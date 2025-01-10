import * as path from "path";
import { promises as fs } from "fs";
import { app } from "electron";
import {getFormConfigPath} from "./pathResolver.js"
import { triggerFunction } from "./triggerHandler.js";


export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}
export async function getAutoCompleteData(client: any, query: any) {
    const formName = query.formName;
    const config = await getFormConfig(formName)
    console.log(config.autoCompleteFields)
    console.log(config.autoCompleteFields[query.fieldname])
    return getData(client, config.autoCompleteFields[query.fieldname], query);
}


export async function getFormConfig(formName: string) {
    const configFilePath = getFormConfigPath(formName);
    const configModule = await import(configFilePath, { with: { type: "json" } });
    return configModule.default
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
    const sqlQuery = `
      SELECT 
          ${queryConfig.columns.join(", ")}
      FROM ${queryConfig.table}
      WHERE 1=1 ${queryConditions ? "AND (" + queryConditions + ")" : ""}
      LIMIT 20;
    `;

    console.log("Generated SQL Query:", sqlQuery);

    const result: any = await client.query(sqlQuery, params);
    console.log("Result:", result.rows);
    return result.rows;
}

export async function getOrderDesignDetails(client: any, designCode: string) {
  let labourChart = await client.query("SELECT * FROM labour_chart WHERE design_code = $1", [designCode]);
  let rateChart = await client.query("SELECT * FROM rate_chart WHERE design_code = $1", [designCode]);
  return { rateChart: rateChart.rows, labourChart: labourChart.rows };
}
export async function saveForm(client: any, formDataArray: any) {
  let configs = {};
  let savedData = [];

  for (let formData of formDataArray) {
    const path = `forms.${formData.formName}.main.saveForm`
    console.log("func path:", path);
    const result = await triggerFunction(client,{path, inputs:{configs,formData}});
    savedData.push(result);
  }
  let x  = {
    status: "success",
    message: "Data saved successfully",
    data: savedData
  };
  return x
}

export async function saveFormData(
  client: any,
  formData: any,
  configs: any,
  parent_type: any | null = null,
  parent_field: any | null = null,
  parent_id: any = null
) {
  let savedFormData = { ...formData };
  console.log("Saved Form Data:", savedFormData);
   
  if (formData._delete === 1) {
    await deleteData(client, formData, configs);
    savedFormData._operation = 'DELETE';
  } else {
    const formName = formData.formName;
    const { tableName,  primaryKey } = await getFormConfigDetails(formName, configs);
    const { entries, arrayEntries } = processFormData(formData);
    let primaryKeyValue = null;
    if (entries[primaryKey] && await checkIfRecordExists(client, tableName, primaryKey, entries[primaryKey])) {
      primaryKeyValue = await updateData(client, tableName, primaryKey, entries);
      savedFormData._operation = 'UPDATE';
    } else {
      if (parent_type && parent_field && parent_id) {
        entries["parent_type"] = parent_type;
        entries["parent_field"] = parent_field;
        entries["parent_id"] = parent_id;
      }
      primaryKeyValue = await insertData(client, tableName, primaryKey, entries);
      savedFormData._operation = 'INSERT';
    }

    // Add the primary key to the response
    savedFormData[primaryKey] = primaryKeyValue;
    savedFormData._tableName = tableName;

    // Process nested arrays
    for (let [arrayKey, arrayValue] of Object.entries(arrayEntries)) {
      savedFormData[arrayKey] = [];
      for (let element of arrayValue) {
        const childResult = await saveFormData(
          client,
          element,
          configs,
          formName,
          arrayKey,
          primaryKeyValue
        );
        savedFormData[arrayKey].push(childResult);
      }
    }
  }

  return savedFormData;
}

const non_included_fields_from_form = [
  "parent_type", 
  "parent_field", 
  "parent_id", 
  "formName"
];

function processFormData(formData: any): { entries: { [key: string]: any }, arrayEntries: { [key: string]: any } } {
  let entries: { [key: string]: any } = {};
  let arrayEntries: { [key: string]: any } = {};
  for (let [key, value] of Object.entries(formData)) {
    if (!key.startsWith('_') && !non_included_fields_from_form.includes(key)) {
      if (Array.isArray(value)) {
        arrayEntries[key] = value; 
      } else {
        entries[key] = value;
      }
    }
  }
  return { entries, arrayEntries };
}

async function insertData(client: any, tableName: string, primaryKey: string, entries: any) {
  const columns = Object.keys(entries);
  const values = Object.values(entries);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
  let query = `
    INSERT INTO ${tableName} (${columns.join(", ")})
    VALUES (${placeholders})
    RETURNING ${primaryKey};
  `;
  console.log(query)
  const r = await client.query(query, values);
  return r.rows[0]?.[primaryKey];
}

async function updateData(client: any, tableName: string, primaryKey: string, entries: any) {
  const primaryKeyValue = entries[primaryKey];
  delete entries[primaryKey];  // Remove the primary key from entries

  const setClauses = Object.keys(entries)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(entries);

  // Append the primary key value at the end of the values array
  values.push(primaryKeyValue);

  const query = `
    UPDATE ${tableName}
    SET ${setClauses}
    WHERE ${primaryKey} = $${values.length};
  `;

  const result = await client.query(query, values);
  return primaryKeyValue; 
}



async function deleteData( client:any, 
  formData:any, 
  configs:any, 
){
  const { entries, arrayEntries } = processFormData(formData);
  const { tableName,  primaryKey } = await getFormConfigDetails(formData.formName, configs);
  const primaryKeyValue = entries[primaryKey];
  if  (primaryKeyValue && await checkIfRecordExists(client, tableName, primaryKey, primaryKeyValue)){
    for (let [arrayKey, arrayValue] of Object.entries(arrayEntries)) {
      for (let element of arrayValue) {
        await deleteData(client, element, configs);
      }
    }
  
    const query = `
      DELETE FROM ${tableName}
      WHERE ${primaryKey} = $1;
      `;
    await client.query(query, [primaryKeyValue]);

  }
}

export async function getFormConfigDetails(formName: string, configs: any) {
  let config = configs[formName] || await getFormConfig(formName);
  if (!configs[formName]) {
      configs[formName] = config;
  }
  const tableName = config.tableName;
  const primaryKey = config.primary_key || "id";
  return { tableName, primaryKey };
}



async function checkIfRecordExists(client: any, tableName: string, primaryKey: string, primaryKeyValue: any): Promise<boolean> {
  // Query to check if the record exists
  const query = `
    SELECT COUNT(*) AS count 
    FROM ${tableName} 
    WHERE ${primaryKey} = $1;
  `;
  const result = await client.query(query, [primaryKeyValue]);

  // If count > 0, record exists
  return result.rows[0].count > 0;
}