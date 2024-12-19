import React, { useState } from "react";
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

  const CustomeCellEditor = () => {
    return "hello";
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
