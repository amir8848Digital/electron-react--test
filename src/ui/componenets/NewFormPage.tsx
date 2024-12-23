import React, { useEffect, useRef, useState } from "react";
import AutoCompleteDropDown from "../commonComponents/AutoCompleteDropDown";
import TableComponent from "../commonComponents/TableComponent";

const NewFormPage = () => {
  interface FormValues {
    [key: string]: string | Date | null | Date | number;
  }
  interface Customer {
    customer_id: number;
    customer_name: string;
  }
  const fieldName = "orderMaster";
  const fields = [
    { label: "Voucher 1", name: " voucher_part1", type: "text" },
    { label: "Voucher 2", name: " voucher_part2", type: "text" },
    { label: "Voucher 3 ", name: " voucher_part3", type: "text" },
    {
      label: "Voucher 4",
      name: "order_id",
      type: "autoComplete",
    },
    { label: "Date", name: "order_date", type: "calendar" },
    { label: "Currency", name: "currency", type: "text" },
    {
      label: "Customer ID",
      name: "customer_id",
      type: "autoComplete",
    },
    { label: "Customer Name", name: "customer_name", type: "text" },
    { label: "Conversion Factor", name: "conv_fact", type: "text" },
    { label: "Conversion Date", name: "conv_d", type: "calendar" },
    { label: "LMG Sales", name: "lmg_sales", type: "number" },
    { label: "LMP Sales", name: "lmp_sales", type: "number" },
    { label: "LMS Sales", name: "lms_sales", type: "number" },
    { label: "LML Sales", name: "lml_sales", type: "number" },
    { label: "CHI X KT", name: "chi_x_kt", type: "text" },
    { label: "PO Number", name: "po_no", type: "text" },
    { label: "PO Date", name: "po_date", type: "calendar" },
    { label: "Priority", name: "priority", type: "text" },
    { label: "EXP Delivery Date", name: "exp_del_date", type: "calendar" },
    { label: "Product Delivery Date", name: "prod_del_date", type: "calendar" },
    { label: "Order Lock", name: "ord_lock", type: "text" },
    { label: "Password", name: "pwd", type: "text" },
    { label: "LK Sales Price", name: "lk_sales_price", type: "number" },
    { label: "Refresh Date", name: "refresh_date", type: "calendar" },
  ];

  const initialState: FormValues = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "calendar" ? null : "";
    return acc;
  }, {} as FormValues);
  const [formValues, setFormValues] = useState<FormValues>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormValues({
      ...formValues,
      [name]: e.target.value,
    });
  };

  const handleChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormValues({
      ...formValues,
      [name]: Number(e.target.value),
    });
  };

  const handleCalendarChange = (e: any, name: string) => {
    setFormValues({
      ...formValues,
      [name]: e.target.value,
    });
  };

  const handdleSubmit = () => {
    window.electron.insertFormData({
      formData: formValues,
      formName: fieldName,
    });
  };

  const updateStateFunction = (value: any, field: any) => {
    setFormValues({ ...formValues, [field.name]: value });
  };

  return (
    <div className="container-fluid py-3">
      <div className="card shadow my-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Sales Order Master Form</h4>
        </div>
        <form className="row p-4 g-2">
          {fields.map((field, index) => (
            <div className="col-md-4 col-lg-3" key={index}>
              {/* Text Input */}
              {field.type === "text" && (
                <div className="mb-2">
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    id={field.name}
                    className="form-control"
                    value={formValues[field.name] as string}
                    onChange={(e) => handleChange(e, field.name)}
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              )}
              {field.type === "number" && (
                <div className="mb-2">
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    id={field.name}
                    className="form-control"
                    value={formValues[field.name] as number}
                    onChange={(e) => handleChangeNumber(e, field.name)}
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              )}
              {/* Calendar Input */}
              {field.type === "calendar" && (
                <div className="mb-2">
                  <label htmlFor="dateInput" className="form-label">
                    {field.label || "Select Date"}
                  </label>
                  <input
                    type="date"
                    id="dateInput"
                    className="form-control"
                    placeholder="Choose a date"
                    onChange={(e) => handleCalendarChange(e, field.name)}
                  />
                </div>
              )}

              {/* Autocomplete Input */}
              {field.type === "autoComplete" && (
                <div className="mb-3">
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  <AutoCompleteDropDown
                    field={field}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    fieldName={fieldName}
                    updateStateFunction={updateStateFunction}
                  />
                </div>
              )}
            </div>
          ))}
        </form>
        <div className="p-4 text-end">
          <button
            type="submit"
            className="btn btn-success px-4"
            onClick={handdleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="card shadow">
        <div className="p-4">
          {<TableComponent orderId={formValues.order_id as string | number} />}
        </div>
      </div>
    </div>
  );
};

export default NewFormPage;
