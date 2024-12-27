import { app, BrowserWindow, Menu } from "electron";
import {
  getAutoCompleteData,
  isDev,
  insertFormData,
  getFormConfig,
  getOrderDesignDetails,
} from "./util.js";
import { triggerFunction } from "./triggerHandler.js";
// import {  insertData,getSalesOrderData,} from './resourceManager.js';
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import pkg from "pg";
const { Client } = pkg;
import { ipcMain } from "electron";

export const client = new Client({
  user: "chintan",
  host: "3.20.115.50",
  database: "mydb",
  password: "Chintan@8848",
  connectionTimeoutMillis: 150000,
  //port: 10071,
});

client
  .connect()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error.message);
  });

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    // disables default system frame (dont do this if you want a proper working menu bar)
    frame: true,
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  // pollResources(mainWindow);

  ipcMain.handle("getAutoCompleteData", (_, query: any) => {
    return getAutoCompleteData(query);
  });

  ipcMain.handle("getFormConfig", (_, formName: any) => {
    return getFormConfig(formName);
  });

  // ipcMain.handle('insertData', (_,formData:any) => {
  //  return insertData(formData)
  // });
  ipcMain.handle("insertFormData", async (_, formData: any) => {
    return await insertFormData(formData);
  });
  ipcMain.handle("getOrderDesignDetails",async (_, designCode: string) => {
    return await getOrderDesignDetails(designCode);
  });
  ipcMain.handle("triggerFunction",async (_, kwargs: any) => {
    return await triggerFunction(kwargs);
  });

  handleCloseEvents(mainWindow);
  // createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}
