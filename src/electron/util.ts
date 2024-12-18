import { client } from "./main.js";

import * as path from "path";
import { promises as fs } from "fs";
import { app } from "electron";
import {getFormConfigPath} from "./pathResolver.js"

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}
export async function getAutoCompleteData(query: any) {
  try {
    const formName = query.formName;
    const config = await getFormConfig(formName)
    console.log(config.autoCompleteFields)
    console.log(config.autoCompleteFields[query.fieldname])
    return getData(config.autoCompleteFields[query.fieldname], query);

    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
}


export async function getFormConfig(formName: string) {
  try {
    const configFilePath = getFormConfigPath(formName);
    const configModule = await import(configFilePath, { with: { type: "json" } });
    return configModule.default

  } catch (error) {
    console.error(`Error loading config for ${formName}:`, error);
    return {};
  }
}

// Example Usage
async function getData(queryConfig: any, query: any): Promise<any[]> {
  console.log("Query Config:", queryConfig, query);

  let queryConditions = "";
  const params: any[] = [];

  // Add dynamic search condition if query.value exists
  if (query && query.value) {
    const searchValue = query.value.trim().replace(/['"]/g, ''); // Basic sanitization
    const searchPattern = `%${searchValue}%`; // Add wildcards for ILIKE
    queryConditions = queryConfig.searchFields.map((field: any, index: number) => {
      // Add a condition for each search field, dynamically creating placeholders
      params.push(searchPattern); // Add the sanitized value for each search field
      return `${field}::TEXT ILIKE $${index + 1}`; // Create the condition for each field
    }).join(" OR "); // Join conditions with OR
  }

  try {
    // Construct the SQL Query dynamically using parameterized queries
    const sqlQuery = `
      SELECT 
          ${queryConfig.columns.join(", ")}
      FROM ${queryConfig.table}
      WHERE 1=1 ${queryConditions ? "AND (" + queryConditions + ")" : ""}
      LIMIT 20;
    `;

    console.log("Generated SQL Query:", sqlQuery);

    // Execute the query with parameters (assuming `client` is a database client object)
    const result: any = await client.query(sqlQuery, params);
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

export async function insertFormData(formData: any) {
  console.log(formData);
  const baseDirectory = path.join(app.getAppPath(), "src", "electron", "forms");
  console.log("Base Directory:", baseDirectory);
  const filePath = path.join(
    baseDirectory,
    formData.formName,
    `${formData.formName}.json`
  );
  console.log("File Path:", filePath);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(fileContent);
  const tableName = data.table_name;
  const query = `INSERT INTO ${tableName} (${Object.keys(
    formData["formData"]
  ).join(", ")}) 
    VALUES (${Object.values(formData["formData"])
      .map((value) => `'${value}'`)
      .join(", ")})`;
  console.log(query);
  await client.query(query);
  console.log("Data inserted successfully!");
}
