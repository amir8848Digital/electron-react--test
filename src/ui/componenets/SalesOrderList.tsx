import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { useNavigate } from "react-router-dom";
const SalesOrderList = () => {
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await window.electron.listview({
        formName: "orderMaster",
        filters: {},
      });
      setOrderList(res);
    };
    fetch();
  }, []);

  
  const defaultColDef = {
    flex: 1,
  };

  const orderIdCellRenderer = (params: any) => {
    return (
      <span
        style={{
          color: "blue",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={() => navigate(`order-design-new/${params.value}`)}
      >
        {params.value}
      </span>
    );
  };

  const columnDefs: any = [
    {
      headerName: "Order ID",
      field: "order_id",
      cellRenderer: orderIdCellRenderer,
    },
    { headerName: "Customer ID", field: "customer_id" },
    { headerName: "Customer Name", field: "customer_name" },
    { headerName: "Order Date", field: "order_date" },
    { headerName: "PO Number", field: "po_no" },
    { headerName: "PO Date", field: "po_date" },
    { headerName: "Priority", field: "priority" },
    { headerName: "Currency", field: "currency" },
  ];

  return (
    <div className="container-fluid p-2">
      <div className={`ag-theme-alpine`} style={{ height: 400 }}>
        <AgGridReact
          theme={"legacy"}
          columnDefs={columnDefs}
          rowData={orderList}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};

export default SalesOrderList;
