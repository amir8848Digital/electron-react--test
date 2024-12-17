import { client } from './main.js';


import * as path from "path";
import { promises as fs } from "fs";
import { app } from "electron";



export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

export async function getMasterData(query: any) {
  try {
    const baseDirectory = path.join(app.getAppPath(), "src", "electron", "forms");
    console.log("Base Directory:", baseDirectory);
    const filePath = path.join(
      baseDirectory,
      query.formName,          
      `${query.formName}.json`
    );
    console.log("File Path:", filePath);

    // Step 3: Read the JSON file content
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    console.log("File Data:", data);
    console.log(query,"QQQQQQQ")
    return getData(data[query.fieldname],query);

  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}

// Example Usage
async function getData(queryConfig: any, query: any) {
  console.log("Query Config:", queryConfig,query);

  let queryConditions = '';

  // Add dynamic search condition if query.value exists
  if (query && query.value) {
      queryConditions = `AND ${queryConfig.searchField}::TEXT ILIKE '%${query.value}%'`;
  }

  try {
      // Construct the SQL Query dynamically
      const sqlQuery = `
          SELECT 
              ${queryConfig.columns.join(', ')}
          FROM ${queryConfig.table}
          WHERE 1=1 ${queryConditions}
          LIMIT 20;
      `;

      console.log("Generated SQL Query:", sqlQuery);

      // Execute the query
      const result = await client.query(sqlQuery);
      return result.rows;

  } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
  }
}

export async function insertFormData(formData: any) {
  console.log(formData)
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
    const query = `INSERT INTO ${tableName} (${Object.keys(formData['formData']).join(", ")}) 
    VALUES (${Object.values(formData['formData']).map(value => `'${value}'`).join(", ")})`;
    console.log(query)
    await client.query(query);
    console.log("Data inserted successfully!");
   

}
