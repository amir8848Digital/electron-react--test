import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import AutoCompleteDropDown from "./AutoCompleteDropDown";
ModuleRegistry.registerModules([AllCommunityModule]);
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
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const handleSelectCustomer = (
    customer: any,
    setFilter: any,
    setIsDropdownOpen: any,
    field: any
  ) => {
    setFilter(customer.customer_name);
    setIsDropdownOpen(false);
    const rowIndex = rowData.findIndex(
      (row: any) => row.design_code === field.name
    );

    if (rowIndex !== -1) {
      const updatedRowData = [...rowData];
      updatedRowData[rowIndex].design_code = customer.customer_id;
      setRowData(updatedRowData);
    }
  };

  const handleBlur = (
    field: any,
    filter: any,
    setFilter: any,
    setFormValues: any,
    setIsDropdownOpen: any,
    setFocusedIndex: any
  ) => {
    if (!filter) {
      setFilter("");
      const rowIndex = rowData.findIndex(
        (row: any) => row.design_code === field.name
      );

      if (rowIndex !== -1) {
        const updatedRowData = [...rowData];
        updatedRowData[rowIndex].design_code = "";
        setRowData(updatedRowData);
      }
    }
    setIsDropdownOpen(false);
    setFocusedIndex(0);
  };
  console.log({ filteredCustomers });
  const handleFilterChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
    fieldname: string,
    isDropdownOpen: any,
    setIsDropdownOpen: any,
    setFilter: any,
    setFilteredCustomers: any
  ) => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
    setFilter(e.target.value);
    const res = await window.electron.getAutoCompleteData({
      formName: fieldName,
      fieldname: field.name,
      value: e.target.value,
    });
    setFilteredCustomers(res || []);
  };

  const CustomeCellEditor = (props: any) => {
    const { field, headerName } = props.colDef;
    const val = {
      name: field,
      label: headerName,
    };
    return (
      <AutoCompleteDropDown
        field={val}
        filteredCustomers={filteredCustomers}
        setFilteredCustomers={setFilteredCustomers}
        formValues={rowData}
        setFormValues={setRowData}
        fieldName={fieldName}
        handleSelectRow={handleSelectCustomer}
        handleBlur={handleBlur}
        handleFilterChange={handleFilterChange}
        configName={"orderMaster"}
      />
    );
  };

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

  useEffect(() => {
    const fetch = async () => {
      const res2 = await window.electron.getFormConfig("orderDesign");
    };
    fetch(); // Fetch form configuration on component mount
  }, []);

  const columnDefs = [
    { headerName: "Order ID", field: "order_id", editable: false },
    {
      headerName: "Design Code",
      field: "design_code",
      editable: true,
      cellEditor: CustomeCellEditor, // Replace this with a custom cell editor if needed
    },
    { headerName: "Suffix", field: "suffix", editable: true },
    { headerName: "Size", field: "size", editable: true },
    { headerName: "Quantity", field: "qty", editable: true },
    { headerName: "Calculated Price", field: "calc_price", editable: true },
    { headerName: "Sales Price", field: "sales_price", editable: true },
    {
      headerName: "Prod Delivery Date",
      field: "prod_dely_date",
      editable: true,
    },
    {
      headerName: "Expected Delivery Date",
      field: "exp_dely_date",
      editable: true,
    },
    { headerName: "Prod Setting", field: "prod_setting", editable: true },
    { headerName: "Fixed Price", field: "fixed_price", editable: true },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <div className="text-end mb-3">
        <button onClick={addRow} className="btn btn-success">
          Add Row
        </button>
      </div>
      <AgGridReact
        rowData={rowData}
        // @ts-ignore
        columnDefs={columnDefs}
        defaultColDef={{
          flex: 1,
          resizable: true,
          sortable: true,
          filter: true,
        }}
        //   editType="fullRow"
      />
    </div>
  );
};

export default TableComponent;
