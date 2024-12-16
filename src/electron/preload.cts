
const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  
  getStaticData: () => ipcInvoke('getStaticData'),
  getSalesOrderData:()=> ipcInvoke('getSalesOrderData'),
  insertData: (formData?: any): Promise<any> => ipcInvoke('insertData', formData),
} );

function ipcInvoke<Key extends string>(
  key: Key,
  args?: any
): Promise<any> {
  return electron.ipcRenderer.invoke(key, args);
}
function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
   electron.ipcRenderer.send(key, payload);

}
