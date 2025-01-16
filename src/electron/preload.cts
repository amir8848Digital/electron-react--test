
const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  
  getAutoCompleteData: (query:any) => ipcInvoke('getAutoCompleteData',query),
  listview: (args:any) => ipcInvoke('listview',args),
  getFormConfig: (formName:any) => ipcInvoke('getFormConfig',formName),
  getOrderDesignDetails: (designCode:string) => ipcInvoke('getOrderDesignDetails',designCode),
  triggerFunction: (kwargs:any) => ipcInvoke('triggerFunction',kwargs),
  saveForm: (kwargs:any) => ipcInvoke('saveForm',kwargs),
} );

function ipcInvoke<Key extends string>(
  key: Key,
  args?: any
): Promise<any> {
  return electron.ipcRenderer.invoke(key, args);
}