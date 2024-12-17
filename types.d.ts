type EventPayloadMapping = {
  getMasterData: any;
  //insertData:any;
  getSalesOrderData:any;
  query:any;
  insertFormData:any
};

interface Window {
  electron: {
    getMasterData: any;
    //insertData: any;
    getSalesOrderData:any;
    insertFormData:any
  };
}
