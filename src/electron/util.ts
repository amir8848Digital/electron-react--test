import * as path from "path";
import { promises as fs } from "fs";
import { app } from "electron";
import {getFormConfigPath} from "./pathResolver.js"

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}
export async function getAutoCompleteData(client: any, query: any) {
  try {
    const formName = query.formName;
    const config = await getFormConfig(formName)
    console.log(config.autoCompleteFields)
    console.log(config.autoCompleteFields[query.fieldname])
    return getData(client, config.autoCompleteFields[query.fieldname], query);

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

async function getData(client: any, queryConfig: any, query: any): Promise<any[]> {
  console.log("Query Config:", queryConfig, query);

  let queryConditions = "";
  const params: any[] = [];

  if (query && query.value) {
    const searchValue = query.value.trim().replace(/['"]/g, '');
    const searchPattern = `%${searchValue}%`;
    queryConditions = queryConfig.searchFields.map((field: any, index: number) => {
      params.push(searchPattern);
      return `${field}::TEXT ILIKE $${index + 1}`;
    }).join(" OR ");
  }

  try {
    const sqlQuery = `
      SELECT 
          ${queryConfig.columns.join(", ")}
      FROM ${queryConfig.table}
      WHERE 1=1 ${queryConditions ? "AND (" + queryConditions + ")" : ""}
      LIMIT 20;
    `;

    console.log("Generated SQL Query:", sqlQuery);

    const result: any = await client.query(sqlQuery, params);
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

export async function  insertFormData(client:any, formDataArray: any) {
  let configs = <any>{}
  let row_record_map = <any>{}
  let dependentFormData = <any>[]
  for (let formData of formDataArray) {
    await insertData(client, formData, configs, row_record_map, dependentFormData);
  }
  for (let formData of dependentFormData) {
    await insertData(client, formData, configs, row_record_map, null);
  }
}

async function  insertData(client:any, formData: any, configs: any, row_record_map: any, dependentFormData: any[] | null) {
    const formName = formData.formName
    let config = configs[formName] || await getFormConfig(formName);
    if (!configs[formName]) {
      configs[formName] = config;
    }
    const tableName = config.tableName;

    if (config?.dependent === 1){
      if (dependentFormData !== null){
        dependentFormData.push(formData);

      }
      for (let dependentField of config.dependentFields){
        formData.formData[dependentField.foreign_column] = row_record_map[dependentField.dependentTable][dependentField.foreign_row_id][formData.formData[dependentField.foreign_column]];
      }
    }
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
    const r = await client.query(query, values);
    if (primaryKey && config?.dependent_on === 1) {
        const insertedPrimaryKey = r.rows[0]?.[primaryKey];
        row_record_map[tableName] ??= {};
        row_record_map[tableName][config.row_id] ??= {};
        row_record_map[tableName][config.row_id][formData.formData[config.row_id]] = insertedPrimaryKey;
      }
  console.log("Data inserted successfully!");
}

export async function getOrderDesignDetails(client: any, designCode: string) {
    let rateChart = await client.query("SELECT * FROM rate_chart WHERE design_code = $1", [designCode]);
    let labourChart = await client.query("SELECT * FROM labour_chart WHERE design_code = $1", [designCode]);
    return { rateChart: rateChart.rows, labourChart: labourChart.rows };
}
