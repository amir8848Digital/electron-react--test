
const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  
  getMasterData: (query:any) => ipcInvoke('getMasterData',query),
  getSalesOrderData:()=> ipcInvoke('getSalesOrderData'),
 // insertData: (formData?: any): Promise<any> => ipcInvoke('insertData', formData),
  insertFormData: (formData?: any): Promise<any> => ipcInvoke('insertFormData', formData),
} );

function ipcInvoke<Key extends string>(
  key: Key,
  args?: any
): Promise<any> {
  console.log(key,args,"IPC")
  return electron.ipcRenderer.invoke(key, args);
}