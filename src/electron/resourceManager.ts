import osUtils from 'os-utils';
import os from 'os';
import fs from 'fs';
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';
import { client } from './main.js';

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    ipcWebContentsSend('statistics', mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

export async function getStaticData() {
  try {
    const sqlQuery = `
        SELECT customer_id, customer_name
        FROM Customers        
        LIMIT 20;
    `;
    console.log("SQL Query:", sqlQuery);

    const result = await client.query(sqlQuery);
    return result.rows;

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}


function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  // requires node 18
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}
