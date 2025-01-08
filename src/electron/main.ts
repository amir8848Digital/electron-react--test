import { app, BrowserWindow, Menu } from "electron";
import {
  getAutoCompleteData,
  isDev,
  getFormConfig,
  getOrderDesignDetails,
  saveForm,
} from "./util.js";
import { triggerFunction } from "./triggerHandler.js";
// import {  insertData,getSalesOrderData,} from './resourceManager.js';
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { ipcMain } from "electron";
import { performTransaction } from "./db.js";


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

  ipcMain.handle("getAutoCompleteData", async (_, query: any) => {
    return await performTransaction("readOnly", async (client) => {
      return await getAutoCompleteData(client, query);
    });
  });

  ipcMain.handle("getFormConfig", (_, formName: any) => {
    return getFormConfig(formName);
  });
  ipcMain.handle("insertFormData", async (_, formData: any) => {
    return await performTransaction("write", async (client) => {
     // return await insertFormData(client, formData);
    });
  });
  ipcMain.handle("getOrderDesignDetails",async (_, designCode: string) => {
    return await performTransaction("readOnly", async (client) => {
      return await getOrderDesignDetails(client, designCode);
    });
  });
  ipcMain.handle("triggerFunction",async (_, kwargs: any) => {
    return await performTransaction("readOnly", async (client) => {
      return await triggerFunction(client,kwargs);
    });
   
  });
  ipcMain.handle("saveForm",async (_, kwargs: any) => {
   console.log("saveForm",kwargs);
    return await performTransaction("write", async (client) => {
      return await saveForm(client,kwargs);
    });
   
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
