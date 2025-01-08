import * as path from "path";
import { promises as fs } from "fs";
import { app } from "electron";
import {getFormConfigPath} from "./pathResolver.js"

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

// export async function  insertFormData(client:any, formDataArray: any) {
//   let configs = <any>{}
//   let row_record_map = <any>{}
//   let dependentFormData = <any>[]
//   for (let formData of formDataArray) {
//     await insertData(client, formData, configs, row_record_map, dependentFormData);
//   }
//   for (let formData of dependentFormData) {
//     await insertData(client, formData, configs, row_record_map, null);
//   }
// }

// async function  insertData(client:any, formData: any, configs: any, row_record_map: any, dependentFormData: any[] | null) {
//     const formName = formData.formName
//     let config = configs[formName] || await getFormConfig(formName);
//     if (!configs[formName]) {
//       configs[formName] = config;
//     }
//     const tableName = config.tableName;

//     if (config?.dependent === 1){
//       if (dependentFormData !== null){
//         dependentFormData.push(formData);

//       }
//       for (let dependentField of config.dependentFields){
//         formData.formData[dependentField.foreign_column] = row_record_map[dependentField.dependentTable][dependentField.foreign_row_id][formData.formData[dependentField.foreign_column]];
//       }
//     }
//     const filteredEntries = Object.entries(formData.formData).filter(
//       ([_, value]) => value !== null && value !== undefined && value !== ""
//     );
//     if (filteredEntries.length === 0) {
//       console.log("No valid data to insert.");
//       return;
//     }
    
//     const columns = filteredEntries.map(([key]) => key);
//     const values = filteredEntries.map(([_, value]) => value);
//     const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

//     const primaryKey = config.primary_key || null; 

//     let query = `
//       INSERT INTO ${tableName} (${columns.join(", ")})
//       VALUES (${placeholders})
//     `;
//     if (primaryKey) {
//       query += ` RETURNING ${primaryKey};`;
//     }
//     const r = await client.query(query, values);
//     if (primaryKey && config?.dependent_on === 1) {
//         const insertedPrimaryKey = r.rows[0]?.[primaryKey];
//         row_record_map[tableName] ??= {};
//         row_record_map[tableName][config.row_id] ??= {};
//         row_record_map[tableName][config.row_id][formData.formData[config.row_id]] = insertedPrimaryKey;
//       }
//   console.log("Data inserted successfully!");
// }

export async function getOrderDesignDetails(client: any, designCode: string) {
    let rateChart = await client.query("SELECT * FROM rate_chart WHERE design_code = $1", [designCode]);
    let labourChart = await client.query("SELECT * FROM labour_chart WHERE design_code = $1", [designCode]);
    return { rateChart: rateChart.rows, labourChart: labourChart.rows };
}

export async function saveForm(client:any, formDataArray: any) {
  let configs = {};
  formDataArray = [{
    "order_id": 1,
    "order_date": "2023-10-01",
    "order_status": "pending",
    "order_type": "custom",
    "formName": "orderMaster",
    "order_design": [
        {
            "design_code": 1,
            "formName": "orderDesign",
            "rate_chart": [
                {
                    "rate_id": 1,
                    "rate_name": "rate1",
                    "rate_value": 100,
                    "formName": "rateChart",
                }
            ],
            "labour_chart": [
                {
                    "labour_id": 1,
                    "labour_name": "labour1",
                    "labour_value": 100,
                    "formName": "labourChart",
                }
            ]
        }
    ]
  }]
  for (let formData of formDataArray) {
      await saveFormData(client, formData, configs);
  }
}



const non_included_fields_from_form = [
  "parent_type", 
  "parent_field", 
  "parent_id", 
  "formName"
];
async function saveFormData(
  client:any, 
  formData:any, 
  configs:any, 
  parent_type: any | null = null,
  parent_field: any | null = null,
  parent_id: any = null
  ) 
{
  const formName = formData.formName;
  let config = configs[formName] || await getFormConfig(formName);
  if (!configs[formName]) {
      configs[formName] = config;
  }
  const tableName = config.tableName;
  const primaryKey = config.primary_key || "id";
  let primaryKeyValue = null;
  const { entries, arrayEntries } = processFormData(formData);
  if (formData._delete === 1 && entries[primaryKey] && await checkIfRecordExists(client, tableName, primaryKey, entries[primaryKey])) {
    await deleteData(client, tableName, primaryKey, entries[primaryKey]);
  }
  else{
    if (entries[primaryKey] && await checkIfRecordExists(client, tableName, primaryKey, entries[primaryKey])) {
      primaryKeyValue = await updateData(client, tableName, primaryKey, entries);
    }
    else{
      if (parent_type && parent_field && parent_id) {
          entries["parent_type"] = parent_type;
          entries["parent_field"] = parent_field;
          entries["parent_id"] = parent_id;
      }
      primaryKeyValue = await insertData(client, tableName, primaryKey, entries);
    }
    
    for (let [arrayKey, arrayValue] of Object.entries(arrayEntries)) {
      for (let element of arrayValue) {
        await saveFormData(client, element, configs, formName, arrayKey, primaryKeyValue);
      }
    }

  }
  console.log("Data inserted successfully!");
}


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



async function deleteData(client: any, tableName: string, primaryKey: string, primaryKeyValue: any){
  const query = `
    DELETE FROM ${tableName}
    WHERE ${primaryKey} = $1;
    `;
  await client.query(query, [primaryKeyValue]);
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