type EventPayloadMapping = {
  getStaticData: any;
  insertData:any;
  getSalesOrderData:any;
};

interface Window {
  electron: {
    getStaticData: any;
    insertData: any;
    getSalesOrderData:any
  };
}
