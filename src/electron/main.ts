import { app, BrowserWindow, Menu } from "electron";
import { getMasterData, isDev, insertFormData } from "./util.js";
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
  idle_in_transaction_session_timeout: 1500,
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

  ipcMain.handle("getMasterData", (_, query: any) => {
    return getMasterData(query);
  });

  // ipcMain.handle('insertData', (_,formData:any) => {
  //  return insertData(formData)
  // });
  ipcMain.handle("insertFormData", (_, formData: any) => {
    return insertFormData(formData);
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
