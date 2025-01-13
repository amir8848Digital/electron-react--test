import React, { useEffect, useState } from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";
import RateChartTable from "./RateChartTable";
import LabourChartTable from "./LabourChartTable";

type Row = {
  sr_no: number;
  parent_id: number;
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
  formName: string;
};

interface TableComponentProps {
  orderId: number;
  orderMaster: any;
  setOrderMaster: any;
  formObj: any;
}

const TableComponent: React.FC<TableComponentProps> = ({
  orderId,
  orderMaster,
  setOrderMaster,
  formObj,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>();
  const fieldName = "orderDesign";
  const orderChartField = "orderRateChart";
  const orderLabourField = "orderLabourChart";

  const initialDataLabourChart = {
    _order_design_id: null,
    maind_cd: "",
    sub_cd: "",
    by_qw: 0,
    quantity: 0,
    rate: 0,
    value: 0,
    formName: "orderLabourChart",
  };

  const [dataRateChart, setDataRateChart] = useState<any[]>([]);
  const [dataLabourChart, setDataLabourChart] = useState<any[]>([]);

  const handleRowChange = (
    rowId: number | string,
    field: keyof Row,
    value: any,
    index: number
  ) => {
    console.log(field, index, value);
    let updatedRowData = [...orderMaster.order_design];
    updatedRowData = updatedRowData.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    console.log(updatedRowData);
    // setRowData(updatedRowData);
    setOrderMaster({
      ...orderMaster,
      order_design: updatedRowData,
    });
  };

  // sr_no: orderMaster.order_design?.length + 1,
  // parent_id: orderId,
  // design_code: "",
  // suffix: "",
  // size: 0,
  // qty: 0,
  // calc_price: 0,
  // sales_price: 0,
  // prod_dely_date: "",
  // exp_dely_date: "",
  // prod_setting: "",
  // fixed_price: 0,
  // formName: "orderDesign",

  const addRow = () => {
    // const newRow = Object.entries(formObj.tableOne.tableFields)
    //   .filter(([_, field]: [string, any]) => field.show)
    //   .reduce((acc: any, [name, field]: [string, any]) => {
    //     acc[name] = field.type === "number" ? 0 : "";
    //     return acc;
    //   }, {});
    const newRow = {
      sr_no: orderMaster.order_design?.length + 1,
      parent_id: orderId,
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
      formName: "orderDesign",
    };

    setOrderMaster({
      ...orderMaster,
      order_design: [...orderMaster.order_design, newRow],
    });
  };

  const initailDataRateChart = {
    _order_design_id: null,
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
    formName: "orderRateChart",
  };

  const handleAddTable = (row: any, index: number) => {
    setActiveIndex(index);
    console.log(row);
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

  // const handleMainSubmit = () => {
  //   const combinedData: any[] = [];

  //   dataRateChart.forEach((item) => {
  //     combinedData.push({
  //       formData: item,
  //       formName: orderChartField,
  //     });
  //   });

  //   dataLabourChart.forEach((item) => {
  //     combinedData.push({
  //       formData: item,
  //       formName: orderLabourField,
  //     });
  //   });

  //   setOrderMaster.rowData.forEach((item: any) => {
  //     combinedData.push({
  //       formData: item,
  //       formName: fieldName,
  //     });
  //   });
  //   window.electron.insertFormData(combinedData);
  // };

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
              <h6 className="px-4">{formObj.tableOne.title}</h6>
            </div>
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr>
                  {Object.keys(formObj.tableOne.tableFields).map(
                    (field: string, index: number) => {
                      const fieldData = formObj.tableOne.tableFields[field];
                      return fieldData.show ? (
                        <th key={index} className="fs-10">
                          {fieldData.label}
                        </th>
                      ) : null; // Render header only if `show` is true
                    }
                  )}
                </tr>
              </thead>
              <tbody>
                {orderMaster?.order_design?.map((row: any, index: any) => {
                  return (
                    <tr
                      key={index}
                      className={`${
                        activeIndex === index ? "table-active" : ""
                      } `}
                    >
                      <td>{row.sr_no}</td>
                      <td>{row.parent_id}</td>
                      <td>
                        <AutoCompleteDropDown
                          field={{
                            name: "design_code",
                            rowId: row.order_id,
                            label: "Design Code",
                          }}
                          formValues={orderMaster.order_design}
                          fieldName={fieldName}
                          updateStateFunction={(value: string) =>
                            handleRowChange(
                              row.order_id as number,
                              "design_code",
                              value,
                              index
                            )
                          }
                          defaultValue={row.design_code}
                        />
                      </td>
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
                      <td>
                        <button
                          onClick={() => handleAddTable(row, index)}
                          className="btn btn-success fs-10"
                        >
                          fetch
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
          <div className="col-6 my-2">
            {typeof activeIndex === "number" &&
            orderMaster.order_design[activeIndex] ? (
              <RateChartTable
                data={orderMaster}
                setData={setOrderMaster}
                index={activeIndex}
                setOrderMaster={setOrderMaster}
              />
            ) : (
              ""
            )}
          </div>
          <div className="col-6 my-2">
            {typeof activeIndex === "number" &&
            orderMaster.order_design[activeIndex] ? (
              <LabourChartTable
                data={orderMaster}
                setData={setOrderMaster}
                index={activeIndex}
                setOrderMaster={setOrderMaster}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        {/* <div className="p-4 text-end">
          <button
            type="submit"
            className="btn btn-success px-4 fs-10"
            onClick={handleMainSubmit}
          >
            Submit
          </button>
        </div> */}
      </div>
    </>
  );
};

export default TableComponent;
