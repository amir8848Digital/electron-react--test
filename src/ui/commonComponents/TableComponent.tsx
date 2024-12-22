import React, { useEffect, useState } from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";

type Row = {
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

const TableComponent: React.FC = () => {
  const fieldName = "orderDesign";
  const [rowData, setRowData] = useState<Row[]>([
    {
      order_id: 1,
      design_code: "",
      suffix: "",
      size: 0,
      qty: 0,
      calc_price: 0,
      sales_price: 0,
      prod_dely_date: "",
      exp_dely_date: "",
      prod_setting: "",
      fixed_price: 0,
    },
  ]);
 
  
  // const handleSelectCustomer = (
  //   customer: any,
  //   setFilter: any,
  //   setIsDropdownOpen: any,
  //   field: any
  // ) => {
  //   setFilter(customer.design_code);
  //   setIsDropdownOpen(false);
  //   const updatedRowData = rowData.map((row) => {
  //     if (row.order_id === field.rowId) {
  //       return { ...row, design_code: customer.design_code };
  //     }
  //     return row;
  //   });
  //   setRowData(updatedRowData);
  //   setIsDropdownOpen(false);
  // };

  // const handleBlur = (
  //   field: any,
  //   filter: any,
  //   setFilter: any,
  //   setFormValues: any,
  //   setIsDropdownOpen: any,
  //   setFocusedIndex: any
  // ) => {
  //   if (!filter) {
  //     setFilter("");
  //     const updatedRowData = rowData.map((row) => {
  //       if (row.order_id === field.rowId) {
  //         return { ...row, design_code: "" };
  //       }
  //       return row;
  //     });

  //     setRowData(updatedRowData);
  //   }
  //   setIsDropdownOpen(false);
  //   setFocusedIndex(0);
  // };

  // const handleFilterChange = async (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: any,
  //   fieldName: any,
  //   isDropdownOpen: any,
  //   setIsDropdownOpen: any,
  //   setFilter: any,
  //   setFilteredCustomers: any
  // ) => {
  //  setIsDropdownOpen(true)
  //  setFilter(e.target.value)
  //   const res = await window.electron.getAutoCompleteData({
  //     formName: fieldName,
  //     fieldname: field.name,
  //     value: e.target.value,
  //   });
  //   const updatedRowData = rowData.map((row) => {
  //     if (row.order_id === field.rowId) {
  //       return { ...row, design_code: e.target.value};
  //     }
  //     return row;
  //   });
  //   setRowData(updatedRowData)
  //   setFilteredCustomers(res);
  // };

  const updatRowData = (
       value:any,
       field: any,
  )=>{
        const updatedRowData = rowData.map((row) => {
      if (row.order_id === field.rowId) {
        return { ...row, design_code: value};
      }
      return row;
    });
    setRowData(updatedRowData)
  }
  

  const addRow = () => {
    const newRow: Row = {
      order_id: rowData.length + 1,
      design_code: "",
      suffix: "",
      size: 0,
      qty: 0,
      calc_price: 0,
      sales_price: 0,
      prod_dely_date: "",
      exp_dely_date: "",
      prod_setting: "",
      fixed_price: 0,
    };
    setRowData([...rowData, newRow]);
  };

  // useEffect(() => {
  //   const fetch = async () => {
  //     await window.electron.getFormConfig("orderDesign");
  //   };
  //   fetch(); 
  // }, []);
  // console.log({ filteredCustomers });

  return (
    <div className="container-fluid">
      <div className="text-end mb-3">
        <button onClick={addRow} className="btn btn-success">
          Add Row
        </button>
      </div>
      <table className="table table-bordered" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Design Code</th>
            <th>Suffix</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Calculated Price</th>
            <th>Sales Price</th>
            <th>Prod Delivery Date</th>
            <th>Expected Delivery Date</th>
            <th>Prod Setting</th>
            <th>Fixed Price</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((row) => (
            <tr key={row.order_id}>
              <td>{row.order_id}</td>
              <td>
                <AutoCompleteDropDown
                  field={{
                    name: "design_code",
                    rowId: row.order_id,
                    label: "Design Code",
                  }}
                  formValues={rowData}
                  setFormValues={setRowData}
                  fieldName={fieldName}
                  updateStateFunction={updatRowData}
                />
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.suffix}
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.size}
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.qty}
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.calc_price}
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.sales_price}
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.prod_dely_date}
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.exp_dely_date}
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.prod_setting}
              </td>
              <td contentEditable suppressContentEditableWarning>
                {row.fixed_price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
