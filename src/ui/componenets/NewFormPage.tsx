import React, { useEffect, useRef, useState } from "react";
import AutoCompleteDropDown from "../commonComponents/AutoCompleteDropDown";
import TableComponent from "../commonComponents/TableComponent";
import ModalForm from "../commonComponents/ModalForm";
import CommonFormComponent from "../commonComponents/CommonFormComponent";

const NewFormPage = () => {
  interface FormValues {
    [key: string]: string | Date | null | Date | number ;
  }
  interface Customer {
    customer_id: number;
    customer_name: string;
  }

  type Row = {
    sr_no: number;
    order_id: number;
    design_code: string;
    suffix: string;
    size: number;
    qty: number;
    calc_price: number;
    sales_price: number;
    prod_dely_date: string;
    exp_dely_date: string;
    prod_setting: string;
    fixed_price: number;
  };

  const formObj = {
    fieldName: "orderMaster",
    fields: [
      {
        label: "Voucher 1",
        name: "voucher_part1",
        type: "text",
        table: "order_master",
        show: true,
        disabled: false,
      },
      {
        label: "Voucher 2",
        name: "voucher_part2",
        type: "text",
        show: true,
        disabled: false,
      },
      {
        label: "Voucher 3 ",
        name: "voucher_part3",
        type: "text",
        show: true,
        disabled: false,
      },
      {
        label: "Voucher 4",
        name: "order_id",
        type: "autoComplete",
      },
      {
        label: "Date",
        name: "order_date",
        type: "calendar",
        table: "order_master_item",
      },
      { label: "Currency", name: "currency", type: "text" },
      {
        label: "Customer ID",
        name: "customer_id",
        type: "autoComplete",
      },
      {
        label: "Customer Name",
        name: "customer_name",
        type: "text",
        table: "rate_charts",
      },
      { label: "Conversion Factor", name: "conv_fact", type: "text" },
      { label: "Conversion Date", name: "conv_d", type: "calendar" },
      { label: "LMG Sales", name: "lmg_sales", type: "number" },
      { label: "LMP Sales", name: "lmp_sales", type: "number" },
      { label: "LMS Sales", name: "lms_sales", type: "number" },
      { label: "LML Sales", name: "lml_sales", type: "number" },
      { label: "CHI X KT", name: "chi_x_kt", type: "text" },
      { label: "PO Number", name: "po_no", type: "text" },
      { label: "PO Date", name: "po_date", type: "calendar", },
      { label: "Priority", name: "priority", type: "text" },
      { label: "EXP Delivery Date", name: "exp_del_date", type: "calendar"  },
      {
        label: "Product Delivery Date",
        name: "prod_del_date",
        type: "calendar",
      },
      { label: "Order Lock", name: "ord_lock", type: "text" },
      { label: "Password", name: "pwd", type: "text" },
      { label: "LK Sales Price", name: "lk_sales_price", type: "number" },
      { label: "Refresh Date", name: "refresh_date", type: "calendar" },
      {
        label:"Is New",
        name:"is_new",
        value:1,
        show:false,
      }
    ],
    tableOne: {
      title: "Order Design",
      name: "order_design",
      tableFields: {
        _sr_no: { label: "Sr No", type: "number", show: true },
        order_id: { label: "Order ID", type: "number", show: true },
        design_code: { label: "Design Code", type: "autoComplete", show: true },
        suffix: { label: "Suffix", type: "text", show: true },
        size: { label: "Size", type: "text", show: true },
        qty: { label: "Quantity", type: "number", show: true },
        calc_price: { label: "Calculated Price", type: "number", show: true },
        sales_price: { label: "Sales Price", type: "number", show: true },
        prod_dely_date: {
          label: "Prod Delivery Date",
          type: "date",
          show: true,
        },
        exp_dely_date: {
          label: "Expected Delivery Date",
          type: "date",
          show: true,
        },
        prod_setting: { label: "Prod Setting", type: "text", show: true },
        fixed_price: { label: "Fixed Price", type: "number", show: true },
        actions: { label: "Actions", type: "button", show: true },
        formName: { label: "fieldName", type: "text", show: false },
      },
    },
  };

  const initializeFieldValue = (field: typeof formObj.fields[number]) => {
    if (field.type === "calendar") return null;
    if (field.type === "number") return 0;
    return field.value ? 1  : "";
  };

  const initialState: FormValues = formObj.fields.reduce((acc, field) => {
    acc[field.name] = initializeFieldValue(field) ;
    return acc;
  }, {} as FormValues);
  const [orderMaster, setOrderMaster] = useState<any>({
    ...initialState,
    order_design: [],
  });

  
  console.log(orderMaster)
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (data: Record<string, any>) => {
    window.electron.insertFormData([
      { formData: data, formName: "orderDetails" },
    ]);
    console.log("Form submitted with data:", data);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handdleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await window.electron.saveForm([
      {
        ...orderMaster,
        formName: formObj.fieldName,
      },
    ]);
    console.log(res, "handdleSubmit");
    setOrderMaster(res?.data?.orderMaster);
  };

  return (
    <div className="container-fluid">
      <div className="card shadow my-4">
        <CommonFormComponent
          formMainObj={formObj}
          orderMaster={orderMaster}
          setOrderMaster={setOrderMaster}
        />
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
          </div>
        </div>
      </div>
      <div className="card shadow">
        <div className="">
          {
            <TableComponent
              orderId={orderMaster.order_id as number}
              orderMaster={orderMaster}
              setOrderMaster={setOrderMaster}
              formObj={formObj}
            />
          }
        </div>
      </div>
      <div>
        {showModal && (
          <ModalForm
            orderMasterId={orderMaster?.order_id as number}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        )}
      </div>
         <div className="p-4 text-end">
          <button
            className="btn btn-success px-4 fs-10"
           onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
    </div>
  );
};

export default NewFormPage;
