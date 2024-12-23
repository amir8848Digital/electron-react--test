import React, { useEffect, useState } from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";
import RateChartTable from "./RateChartTable";
import LabourChartTable from "./labourChartTable";

type Row = {
  sr_no: number;
  order_id: number | string | number | null;
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

interface TableComponentProps {
  orderId: string | number | null;
}

const TableComponent: React.FC<TableComponentProps> = ({ orderId }) => {
  const fieldName = "orderDesign";
  const orderChartField = "orderRateChart";
  const orderLabourField = "orderLabourChart";
  const [rowData, setRowData] = useState<Row[]>([
    // {
    //   sr_no: 0,
    //   order_id: 0,
    //   design_code: "",
    //   suffix: "",
    //   size: 0,
    //   qty: 0,
    //   calc_price: 0,
    //   sales_price: 0,
    //   prod_dely_date: "",
    //   exp_dely_date: "",
    //   prod_setting: "",
    //   fixed_price: 0,
    // },
  ]);

  useEffect(() => {
    if (orderId) {
      setRowData([
        {
          sr_no: 1,
          order_id: orderId,
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
    }
  }, [orderId]);

  const initailDataRateChart = {
    order_design: null,
    category: "",
    sub_category: "",
    sv_ln: "",
    breadth: 0,
    depth: 0,
    quantity: 0,
    pm_pointer: "",
    wt: 0,
    lme_rate: 0,
    sales_rate: 0,
    qw: 0,
    sales_value: 0,
    production_quantity: 0,
    production_weight: 0,
    setting: "",
    setting_rate: 0,
    setting_value: 0,
    alloy: "",
    alloy_rate: 0,
    wset: 0,
    h_set: 0,
    sshp: 0,
    m_material: "",
  };

  const initialDataLabourChart = {
    order_design: null,
    order_design_id: 0,
    maind_cd: "",
    sub_cd: "",
    by_qw: 0,
    quantity: 0,
    rate: 0,
    value: 0,
  };

  const [dataRateChart, setDataRateChart] = useState<any[]>([]);
  const [dataLabourChart, setDataLabourChart] = useState<any[]>([]);
  console.log({ dataLabourChart });
  const handleRowChange = (
    rowId: number | string,
    field: keyof Row,
    value: any
  ) => {
    const updatedRowData = rowData.map((row) =>
      row.order_id === rowId ? { ...row, [field]: value } : row
    );
    setRowData(updatedRowData);
  };

  const addRow = () => {
    const newRow: Row = {
      sr_no: rowData.length + 1,
      order_id: orderId,
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

  const handleAddTable = (row: Row) => {
    if (row?.design_code) {
      setDataRateChart([
        ...dataRateChart,
        { ...initailDataRateChart, order_design: row.sr_no },
      ]);
      setDataLabourChart([
        ...dataLabourChart,
        { ...initialDataLabourChart, order_design: row.sr_no },
      ]);
    }
  };

  const handleMainSubmit = () => {
    const combinedData: any[] = [];

    dataRateChart.forEach((item) => {
      combinedData.push({
        formData: item,
        formName: orderChartField,
      });
    });

    dataLabourChart.forEach((item) => {
      combinedData.push({
        formData: item,
        formName: orderLabourField,
      });
    });

    rowData.forEach((item) => {
      combinedData.push({
        formData: item,
        formName: fieldName,
      });
    });

    console.log(combinedData,"aaaaaaaaaaaaaaaaaaaaaa");
  };

  return rowData.length > 0 ? (
    <>
      <div className="container-fluid">
        <div className="my-4">
          <div className="text-end mb-3">
            <button onClick={addRow} className="btn btn-success">
              Add Row
            </button>
          </div>
          <div>
            <div>
              <h6 className="px-4">Design Code</h6>
            </div>
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr className="fs-6">
                  <th>Sr No</th>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rowData?.map((row) => (
                  <tr key={row.order_id}>
                    <td>{row.sr_no}</td>
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
                        updateStateFunction={(value: string) =>
                          handleRowChange(
                            row.order_id as number | string,
                            "design_code",
                            value
                          )
                        }
                      />
                    </td>
                    {[
                      "suffix",
                      "size",
                      "qty",
                      "calc_price",
                      "sales_price",
                      "prod_dely_date",
                      "exp_dely_date",
                      "prod_setting",
                      "fixed_price",
                    ].map((field) => (
                      <td key={field}>
                        <input
                          type="text"
                          value={row[field as keyof Row] as string}
                          onChange={(e) =>
                            handleRowChange(
                              row.order_id as number | string,
                              field as keyof Row,
                              e.target.value
                            )
                          }
                          className="form-control"
                        />
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => handleAddTable(row)}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {dataRateChart.length > 0 ? (
              <RateChartTable data={dataRateChart} setData={setDataRateChart} />
            ) : (
              ""
            )}
          </div>
          <div className="col-md-6">
            {dataLabourChart.length > 0 ? (
              <LabourChartTable
                data={dataLabourChart}
                setData={setDataLabourChart}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="p-4 text-end">
          <button
            type="submit"
            className="btn btn-success px-4"
            onClick={handleMainSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  ) : (
    ""
  );
};

export default TableComponent;
