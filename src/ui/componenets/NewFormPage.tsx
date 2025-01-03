import React, { useEffect, useRef, useState } from "react";
import AutoCompleteDropDown from "../commonComponents/AutoCompleteDropDown";
import TableComponent from "../commonComponents/TableComponent";
import ModalForm from "../commonComponents/ModalForm";

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
  const [showModal, setShowModal] = useState(false);
  const [designData, setDesignData] = useState<any>([]);

  const handleSubmit = (data: Record<string, any>) => {
    window.electron.insertFormData([
      { formData: data, formName: "orderDetails" },
    ]);
    console.log("Form submitted with data:", data);
    setShowModal(false); // Close the modal after submission
  };

  const handleClose = () => {
    setShowModal(false);
  };
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
    window.electron.insertFormData([
      {
        formData: formValues,
        formName: fieldName,
      },
    ]);
  };

  const updateStateFunction = (value: any, field: any) => {
    let values = { ...formValues };
    console.log(value, field, fields, "updateStateFunction");
    if (field.type === "autoComplete") {
      values = { ...values, ...value[0] };
    } else {
      values = { ...values, [field.name]: value };
    }
    setFormValues({ ...values });
  };

  const handleOnSelect = async (data: any, value: any) => {
    console.log(data, value, "handleOnSelect");
    if (data?.onSelect?.fetchFullForm) {
      const res = await window.electron.triggerFunction({
        path: data.onSelect.fetchFullForm,
        inputs: {},
      });
      console.log(res?.data?.orderDesign, "handleOnSelect new");
      let orderDesignData = res?.data?.orderDesign || [];

      orderDesignData =
        orderDesignData?.length > 0
          ? orderDesignData.filter(
              (item: any) => item.order_id === value[0]?.order_id
            )
          : [];

      console.log(orderDesignData, "orderDesignData handleOnSelect");
      setDesignData(orderDesignData);
    }
  };

  return (
    <div className="container-fluid">
      <div className="card shadow my-4">
        {/* <div className="card-header bg-primary text-white">
          <p className="mb-0 ">Sales Order Master Form</p>
        </div> */}
        <form className="row p-4 g-2">
          {fields.map((field, index) => (
            <div className="col-md-2" key={index}>
              {/* Text Input */}
              {field.type === "text" && (
                <div className="">
                  <label htmlFor={field.name} className="form-label fs-10">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    id={field.name}
                    className="form-control  fs-10"
                    value={formValues[field.name] as string}
                    onChange={(e) => handleChange(e, field.name)}
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              )}
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
                    onChange={(e) => handleChangeNumber(e, field.name)}
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              )}
              {/* Calendar Input */}
              {field.type === "calendar" && (
                <div className="">
                  <label htmlFor="dateInput" className="form-label fs-10">
                    {field.label || "Select Date"}
                  </label>
                  <input
                    type="date"
                    id="dateInput fs-10"
                    className="form-control fs-10"
                    placeholder="Choose a date"
                    value={formValues[field.name] as string}
                    onChange={(e) => handleCalendarChange(e, field.name)}
                  />
                </div>
              )}

              {/* Autocomplete Input */}
              {field.type === "autoComplete" && (
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
                    handleOnSelect={handleOnSelect}
                  />
                </div>
              )}
            </div>
          ))}
        </form>
        <div>
          <div className="d-flex justify-content-end my-2 ">
            <div className="me-2">
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-success fs-10"
              >
                Open Modal
              </button>
            </div>
            <div className="mx-4">
              <button
                type="submit"
                className="btn btn-success px-4 fs-10"
                onClick={handdleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow">
        <div className="">
          {
            <TableComponent
              orderId={formValues.order_id as number}
              designData={designData}
            />
          }
        </div>
      </div>
      <div>
        {showModal && (
          <ModalForm
            orderMasterId={formValues?.order_id as number}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default NewFormPage;
