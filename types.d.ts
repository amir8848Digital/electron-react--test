type EventPayloadMapping = {
  getAutoCompleteData: any;
  getFormConfig:any;
  query:any;
  insertFormData:any
};

interface Window {
  electron: {
    getAutoCompleteData: any;
    //insertData: any;
    getFormConfig:any;
    insertFormData:any
  };
}
