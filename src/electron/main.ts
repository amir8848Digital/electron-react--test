import { app, BrowserWindow, Menu } from 'electron';
import { ipcMainHandle, ipcMainOn, isDev } from './util.js';
import { getStaticData ,insertData,getSalesOrderData} from './resourceManager.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';
import pkg from 'pg';
const { Client } = pkg;
import { ipcMain } from 'electron';

export const client = new Client({
  user: 'root',
  host: 'postgresql-189014-0.cloudclusters.net',
  database: 'Test', 
  password: 'password', 
  port: 10071,
});

client.connect()
  .then(() => {
      console.log("Database connected successfully!");
  })
  .catch((error) => {
      console.error("Failed to connect to the database:", error.message);
  });


app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    // disables default system frame (dont do this if you want a proper working menu bar)
    frame: true,
  });
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(getUIPath());
  }

 // pollResources(mainWindow);

  ipcMainHandle('getStaticData', () => {
    return getStaticData();
  });
  ipcMainHandle('getSalesOrderData', () => {
    return getSalesOrderData();
  });
  
  ipcMain.handle('insertData', (formData:any) => {
   return insertData(formData)
  });
  
  
  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  // createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on('close', (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}
