import React, { useState } from "react";
import AutoCompleteDropDown from "../commonComponents/AutoCompleteDropDown";

type Props = {};

const CustomerForm = (props: Props) => {
  interface FormValues {
    [key: string]: string | number | boolean | null;
  }
  const fieldName = "customers";
  const newFields = [
    { label: "Customer Code", name: "customer_id", type: "dropdown" },
    { label: "Customer Name", name: "customer_name", type: "text" },
    { label: "Currency", name: "currency", type: "text" },
    { label: "Address", name: "address", type: "text" },
    // { label: "Address Line 2  ", name: "address2", type: "text" },
    // { label: "Address Line 3  ", name: "address3", type: "text" },
    // { label: "Address Line 4  ", name: "address4", type: "text" },
    { label: "Phone NO", name: "contact_phone", type: "number" },
    { label: "Mail", name: "contact_email", type: "email" },
    { label: "City", name: "city", type: "text" },
  ];

  const initialState: FormValues = newFields.reduce((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? false : "";
    return acc;
  }, {} as FormValues);

  const [formValues, setFormValues] = useState<FormValues>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    name: string
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    window.electron.insertFormData([
      {
        formData: formValues,
        formName: fieldName,
      },
    ]);
  };

  const updateStateFunction = (value: any, field: any) => {
    let values = { ...formValues };
    if (field.type === "autoComplete") {
      values = { ...values, ...value[0] };
    } else {
      values = { ...values, [field.name]: value };
    }
    setFormValues({ ...values });
  };

  return (
    <form className="row p-4 g-2">
      {newFields.map((field, index) => (
        <div className="col-md-2" key={index}>
          {/* Text Input */}
          {(field.type === "text" || field.type === "email") && (
            <div className="">
              <label htmlFor={field.name} className="form-label fs-10">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                className="form-control fs-10"
                value={formValues[field.name] as string}
                onChange={(e) => handleChange(e, field.name)}
                placeholder={`Enter ${field.label}`}
              />
            </div>
          )}

          {/* Dropdown Input */}
          {field.type === "dropdown" && (
            <div className="">
              <label htmlFor={field.name} className="form-label fs-10">
                {field.label}
              </label>
              <AutoCompleteDropDown
                field={field}
                formValues={formValues}
                setFormValues={setFormValues}
                defaultValue={formValues[field.name]}
                fieldName={fieldName}
                updateStateFunction={updateStateFunction}
                size={"small"}
                // handleOnSelect={handleOnSelect}
              />
            </div>
          )}

          {/* Checkbox Input */}
          {field.type === "checkbox" && (
            <div className="form-check">
              <label htmlFor={field.name} className="form-label fs-10">
                {field.label}
              </label>
              <div className="ms-4">
                <input
                  type="checkbox"
                  id={field.name}
                  className="form-check-input"
                  checked={formValues[field.name] as boolean}
                  onChange={(e) => handleChange(e, field.name)}
                />
              </div>
            </div>
          )}

          {/* Number Input */}
          {field.type === "number" && (
            <div className="">
              <label htmlFor={field.name} className="form-label fs-10">
                {field.label}
              </label>
              <input
                type="number"
                id={field.name}
                className="form-control fs-10"
                value={formValues[field.name] as number}
                onChange={(e) => handleChange(e, field.name)}
                placeholder={`Enter ${field.label}`}
              />
            </div>
          )}
        </div>
      ))}

      <div className="col-12">
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
