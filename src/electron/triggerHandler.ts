import { app } from "electron";
import path from "path";
import { pathToFileURL } from 'url';


export async function triggerFunction(client:any,kwargs: any): Promise<any> {

    const { path: funcPath, inputs } = kwargs;
    if (!funcPath || typeof funcPath !== "string") {
      throw new Error("Invalid function path provided.");
    }
    const func = await resolveFunction(funcPath);

    if (typeof func !== "function") {
      throw new Error(`No callable function found at path: ${funcPath}`);
    }

    const result = await func(client,inputs);

    return {
      success: true,
      data: result,
    };
}

async function resolveFunction(funcPath: string): Promise<any> {
      const pathSegments = funcPath.split(".");
  
      if (pathSegments.length === 0) {
        throw new Error("Invalid path format.");
      }
      const functionName = pathSegments.pop();
      const modulePath = pathSegments.join("/");
      const resolvedPath = path.join(app.getAppPath(), "dist-electron", modulePath + ".js");
      const function_url = pathToFileURL(resolvedPath).href
      const module = await import(function_url); 
      if (!functionName || !(functionName in module)) {
        throw new Error(`No function found at path: ${funcPath}`);
      }
      return module[functionName];
  }
