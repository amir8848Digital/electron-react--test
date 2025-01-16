import React, { useEffect, useRef, useState } from "react";
import AutoCompleteDropDown from "../commonComponents/AutoCompleteDropDown";
import TableComponent from "../commonComponents/TableComponent";
import { MdDelete } from "react-icons/md";
import CommonFormComponent from "../commonComponents/CommonFormComponent";
import { toast, ToastContainer } from "react-toastify";

const NewFormPage = () => {
  useEffect(() => {
    const fetch = async () => {
      const res = await window.electron
        .listview({ formName: "orderMaster", filters: {} })
        .then((res: any) => {
          console.log(res, "order_masterrrrrrrrrrrrr");
        });
    };
    fetch();
  }, []);
  interface FormValues {
    [key: string]: string | Date | null | Date | number | undefined;
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

  const handleAddTable = (
    row: any,
    index: number,
    setActiveIndex: any,
    setOrderMaster: any,
    initailDataRateChart: any,
    initialDataLabourChart: any
  ) => {
    setActiveIndex(index);
    setOrderMaster((prev: any) => {
      const updatedOrderDesign = [...prev.order_design];
      const designIndex = index;

      if (designIndex >= 0 && designIndex < updatedOrderDesign.length) {
        const currentDesign = { ...updatedOrderDesign[designIndex] };
        if (!currentDesign.rate_chart) {
          currentDesign.rate_chart = [{ ...initailDataRateChart }];
        }
        if (!currentDesign.labour_chart) {
          currentDesign.labour_chart = [{ ...initialDataLabourChart }];
        }

        //     currentDesign.rate_chart = [
        //       ...currentDesign.rate_chart,
        //       initailDataRateChart,
        //     ];
        //     currentDesign.labour_chart = [
        //       ...currentDesign.labour_chart,
        //       initialDataLabourChart,
        //     ];
        updatedOrderDesign[designIndex] = currentDesign;
      }

      return {
        ...prev,
        order_design: updatedOrderDesign,
      };
    });
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
      { label: "PO Date", name: "po_date", type: "calendar" },
      { label: "Priority", name: "priority", type: "text" },
      { label: "EXP Delivery Date", name: "exp_del_date", type: "calendar" },
      {
        label: "Product Delivery Date",
        name: "prod_del_date",
        type: "calendar",
      },
      { label: "Order Lock", name: "ord_lock", type: "text" },
      { label: "Password", name: "pwd", type: "text" },
      { label: "LK Sales Price", name: "lk_sales_price", type: "number" },
      { label: "Refresh Date", name: "refresh_date", type: "calendar" },
    ],
    tableOne: {
      title: "Order Design",
      name: "order_design",
      tableFields: {
        parent_id: {
          label: "Order ID",
          name: "parent_id",
          type: "text",
          show: true,
          disabled: true,
        },
        design_code: {
          label: "Design Code",
          value: "design_code",
          type: "autoComplete",
          show: true,
        },
        suffix: { label: "Suffix", name: "suffix", type: "text", show: true },
        size: { label: "Size", name: "size", type: "text", show: true },
        qty: { label: "Quantity", name: "qty", type: "number", show: true },
        calc_price: {
          label: "Calculated Price",
          value: "calc_price",
          type: "number",
          show: true,
        },
        sales_price: {
          label: "Sales Price",
          value: "sales_price",
          type: "number",
          show: true,
        },
        prod_dely_date: {
          label: "Prod Delivery Date",
          name: "prod_dely_date",
          type: "date",
          show: true,
        },
        exp_dely_date: {
          label: "Expected Delivery Date",
          name: "exp_dely_date",
          type: "date",
          show: true,
        },
        prod_setting: {
          label: "Prod Setting",
          name: "prod_setting",
          type: "text",
          show: true,
        },
        fixed_price: {
          label: "Fixed Price",
          name: "fixed_price",
          type: "number",
          show: true,
        },
        actions: {
          label: "fetch",
          type: "button",
          show: false,
          // functionName: handleAddTable,
          // functionParams: [
          //   row,
          //   index,
          //   setActiveIndex,
          //   setOrderMaster,
          //   initailDataRateChart,
          //   initialDataLabourChart,
          // ],
        },
        formName: {
          label: "fieldName",
          name: "orderDesign",
          type: "text",
          show: false,
        },
        _is_deleted: {
          label: "Deleted",
          name: "_is_deleted",
          value: 0,
          type: "icon",
          iconType: <MdDelete className="text-danger" />,
          secondaryIconType: <MdDelete />,
          show: true,
          function: function handleRowAction(
            row: Row,
            index: number,
            state: any,
            setState: any
          ) {
            setState((prevState: any) => {
              const updatedOrderDesign = [...prevState.order_design];

              if (!updatedOrderDesign[index]) {
                console.error(`No order design found at index ${index}`);
                return prevState;
              }
              const currentDesign = { ...updatedOrderDesign[index] };
              if (currentDesign._is_deleted === 1) {
                currentDesign._is_deleted = 0;
              } else if (
                currentDesign._is_deleted === 0 ||
                !currentDesign._is_deleted
              ) {
                currentDesign._is_deleted = 1;
              }
              if (currentDesign._is_deleted === 1 && currentDesign._is_new) {
                updatedOrderDesign.splice(index, 1);
              } else {
                updatedOrderDesign[index] = currentDesign;
              }
              return {
                ...prevState,
                order_design: updatedOrderDesign,
              };
            });
          },
        },
      },
      childTables: [
        { childTableOne: {} },
        {
          childTableTwo: {},
        },
      ],
    },
  };

  const initializeFieldValue = (field: (typeof formObj.fields)[number]) => {
    if (field.type === "calendar") return null;
    if (field.type === "number") return 0;
    return null;
  };

  const initialState: FormValues = formObj.fields.reduce((acc, field) => {
    acc[field.name] = initializeFieldValue(field);
    return acc;
  }, {} as FormValues);

  const [orderMaster, setOrderMaster] = useState<any>({
    ...initialState,
    _is_new: 1,
    order_design: [],
  });
  const [showModal, setShowModal] = useState(false);

  // const handleSubmit = (data: Record<string, any>) => {
  //   window.electron.insertFormData([
  //     { formData: data, formName: "orderDetails" },
  //   ]);
  //   console.log("Form submitted with data:", data);
  //   setShowModal(false);
  // };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(orderMaster, "orderMaster");
    try {
      const res = await window.electron.saveForm([
        {
          ...orderMaster,
          formName: formObj.fieldName,
        },
      ]);
      console.log(res, "handdleSubmit");
      if (res?.data) {
        toast.success(res.message);
        setOrderMaster({ ...res?.data, _is_new: 0 });
      } else {
        toast.error(res.error.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="container-fluid">
      <ToastContainer />
      <div className="card shadow my-4">
        <CommonFormComponent
          formMainObj={formObj}
          orderMaster={orderMaster}
          setOrderMaster={setOrderMaster}
        />
      </div>
      <div className="card shadow">
        <div className="">
          (
          <TableComponent
            orderId={orderMaster?.order_id as number}
            orderMaster={orderMaster}
            setOrderMaster={setOrderMaster}
            formObj={formObj}
          />
          )
        </div>
      </div>

      <div className="p-4 text-end">
        <button className="btn btn-success px-4 fs-10" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewFormPage;
