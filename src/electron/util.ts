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
  const formName = formData.formName
  const config = await getFormConfig(formName)
  const tableName = config.tableName;
  const filteredEntries = Object.entries(formData.formData).filter(
    ([_, value]) => value !== null && value !== undefined && value !== ""
  );

  if (filteredEntries.length === 0) {
    console.log("No valid data to insert.");
    return;
  }

  const columns = filteredEntries.map(([key]) => key);
  const values = filteredEntries.map(([_, value]) => value);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

  // Construct the query
  const query = `
      INSERT INTO ${tableName} (${columns.join(", ")})
      VALUES (${placeholders});
    `;
  console.log("Generated Query:", query);
  console.log("Values:", values);
  const r = await client.query(query, values);
  console.log(r)
  console.log("Data inserted successfully!");
}
