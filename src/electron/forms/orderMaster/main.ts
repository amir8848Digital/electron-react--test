import { saveFormData } from '../../util.js';

export async function saveForm(client:any,kwargs: any) {
    console.log(kwargs)
    const {configs, formData} = kwargs;
    if (kwargs._delete === 1) {
        await beforeDelete()
    }
    else{
        await validate()
        await beforeSave()
    }
    let result = await saveFormData(client, formData, configs);
    if (kwargs._delete === 1) {
        await afterDelete()
    }
    else{
        await afterSave()
    }
    return result;
}

async function validate() {
    console.log("Validate")
}

async function beforeSave() {
    console.log("Before Save")
}
async function afterSave() {
    console.log("After Save")
}
async function beforeDelete() {
    console.log("Before Delete")
}

async function afterDelete() {
    console.log("After Delete")
}