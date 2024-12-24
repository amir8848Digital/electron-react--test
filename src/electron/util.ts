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

export async function  insertFormData(formDataArray: any) {
  let configs = <any>{}
  let row_record_map = <any>{}
  for (let formData of formDataArray) {
    const formName = formData.formName
    let config = configs[formName] || await getFormConfig(formName);
    console.log(config)
    if (!configs[formName]) {
      configs[formName] = config;
    }

    if (config?.dependent !== 1){
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

      const primaryKey = config.primary_key || null; 

      let query = `
        INSERT INTO ${tableName} (${columns.join(", ")})
        VALUES (${placeholders})
      `;
      if (primaryKey) {
        query += ` RETURNING ${primaryKey};`;
      }
      console.log(query, values);
      const r = await client.query(query, values);
      if (primaryKey && config?.dependent_on === 1) {
        const insertedPrimaryKey = r.rows[0]?.[primaryKey];
        console.log("Inserted Primary Key:", insertedPrimaryKey);
        console.log(formData.formData[config.row_id], "row_id")
        row_record_map[tableName] = row_record_map[tableName] || {};
        row_record_map[tableName][formData.formData[config.row_id]] = insertedPrimaryKey;
      }
      console.log("Data inserted successfully!");
    }
  }
  console.log(row_record_map, "row_record_map")
  for (let formData of formDataArray) {
    const formName = formData.formName
    console.log("Form Name:", formName);
    let config = configs[formName] || await getFormConfig(formName);
    if (!configs[formName]) {
      configs[formName] = config;
    }
    console.log("inside dependent")
    console.log(config)

    if (config?.dependent === 1){
      console.log("in loop")
      const tableName = config.tableName;
      console.log("Table Name:", config.dependentTable, config.foreign_row_id, formData.formData[config.foreign_row_id]);
      formData.formData[config.foreign_key] = row_record_map[config.dependentTable][formData.formData[config.foreign_row_id]];
      console.log("Data to insert:", formData.formData);

      const filteredEntries = Object.entries(formData.formData).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      );
      const columns = filteredEntries.map(([key]) => key);
      const values = filteredEntries.map(([_, value]) => value);
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
      let query = `
        INSERT INTO ${tableName} (${columns.join(", ")})
        VALUES (${placeholders})
      `;
      const r = await client.query(query, values);
    }
  }
  console.log("Data inserted successfully!");
}
