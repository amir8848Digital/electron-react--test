import React, { useEffect, useState } from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";
import RateChartTable from "./RateChartTable";
import LabourChartTable from "./LabourChartTable";

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

interface TableComponentProps {
  orderId: number;
  designData: any;
  rowDataForTable1: any;
  setRowDataForTable1: any;
  formObj: any;
}

const TableComponent: React.FC<TableComponentProps> = ({
  orderId,
  designData,
  rowDataForTable1: rowData,
  setRowDataForTable1: setRowData,
  formObj,
}) => {
  const fieldName = "orderDesign";
  const orderChartField = "orderRateChart";
  const orderLabourField = "orderLabourChart";

  const initailDataRateChart = {
    order_design_id: null,
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
    order_design_id: null,
    maind_cd: "",
    sub_cd: "",
    by_qw: 0,
    quantity: 0,
    rate: 0,
    value: 0,
  };

  const [dataRateChart, setDataRateChart] = useState<any[]>([]);
  const [dataLabourChart, setDataLabourChart] = useState<any[]>([]);

  const handleRowChange = (
    rowId: number | string,
    field: keyof Row,
    value: any,
    index: number
  ) => {
    let updatedRowData = [...rowData];
    updatedRowData = updatedRowData.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
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
        { ...initailDataRateChart, order_design_id: row.sr_no },
      ]);
      setDataLabourChart([
        ...dataLabourChart,
        { ...initialDataLabourChart, order_design_id: row.sr_no },
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

    rowData.forEach((item: any) => {
      combinedData.push({
        formData: item,
        formName: fieldName,
      });
    });
    console.log({ combinedData });
    window.electron.insertFormData(combinedData);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="my-4">
          <div className="text-end mb-3">
            <button onClick={addRow} className="btn btn-success fs-10">
              Add Row
            </button>
          </div>
          <div>
            <div>
              <h6 className="px-4">Design Code</h6>
            </div>
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                {formObj?.tableOne?.tableVales?.map((e: any, index: any) => (
                  <tr key={index}>{e.label}</tr>
                ))}
              </thead>
              <tbody>
                {rowData?.map((row: any, index: any) => {
                  console.log(row, "row handleOnSelect");
                  return (
                    <tr key={index}>
                      {/* sr_no as a number */}
                      <td>{Number(row.sr_no)}</td>

                      {/* order_id as a number */}
                      <td>{Number(row.order_id)}</td>

                      {/* design_code dropdown */}
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
                              row.order_id as number,
                              "design_code",
                              value,
                              index
                            )
                          }
                        />
                      </td>

                      {/* Other fields */}
                      {[
                        "suffix",
                        "size",
                        "qty",
                        "calc_price", // This is a number field
                        "sales_price", // This is a number field
                        "prod_dely_date", // This is a date field
                        "exp_dely_date", // This is a date field
                        "prod_setting",
                        "fixed_price", // This is a number field
                      ].map((field) => (
                        <td key={field}>
                          {field === "calc_price" ||
                          field === "sales_price" ||
                          field === "fixed_price" ? (
                            // Render as a number input for price fields
                            <input
                              type="number"
                              value={row[field as keyof Row] as number}
                              onChange={(e) =>
                                handleRowChange(
                                  row.order_id as number | string,
                                  field as keyof Row,
                                  Number(e.target.value),
                                  index
                                )
                              }
                              className="form-control fs-10"
                            />
                          ) : field === "prod_dely_date" ||
                            field === "exp_dely_date" ? (
                            // Render as a date input for date fields
                            <input
                              type="date"
                              value={row[field as keyof Row] as string}
                              onChange={(e) =>
                                handleRowChange(
                                  row.order_id as number | string,
                                  field as keyof Row,
                                  e.target.value,
                                  index
                                )
                              }
                              className="form-control  fs-10"
                            />
                          ) : (
                            // Render as a text input for other fields
                            <input
                              type="text"
                              value={row[field as keyof Row] as string}
                              onChange={(e) =>
                                handleRowChange(
                                  row.order_id as number | string,
                                  field as keyof Row,
                                  e.target.value,
                                  index
                                )
                              }
                              className="form-control fs-10"
                            />
                          )}
                        </td>
                      ))}

                      {/* Add button */}
                      <td>
                        <button
                          onClick={() => handleAddTable(row)}
                          className="btn btn-success fs-10"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-12 my-2">
            {dataRateChart.length > 0 ? (
              <RateChartTable data={dataRateChart} setData={setDataRateChart} />
            ) : (
              ""
            )}
          </div>
          <div className="col-12 my-2">
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
            className="btn btn-success px-4 fs-10"
            onClick={handleMainSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default TableComponent;
