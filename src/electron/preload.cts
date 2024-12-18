
const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  
  getAutoCompleteData: (query:any) => ipcInvoke('getAutoCompleteData',query),
  getFormConfig: (formName:any) => ipcInvoke('getFormConfig',formName),
  insertFormData: (formData: any): Promise<any> => ipcInvoke('insertFormData', formData),
} );

function ipcInvoke<Key extends string>(
  key: Key,
  args?: any
): Promise<any> {
  console.log(key,args,"IPC")
  return electron.ipcRenderer.invoke(key, args);
}