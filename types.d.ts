type EventPayloadMapping = {
  getAutoCompleteData: any;
  getFormConfig:any;
  query:any;
  insertFormData:any;
  getOrderDesignDetails:string;

};

interface Window {
  electron: {
    getAutoCompleteData: any;
    //insertData: any;
    getFormConfig:any;
    insertFormData:any;
    getOrderDesignDetails:any;
    triggerFunction:any;
    saveForm:any;
  };
}
