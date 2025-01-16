import React from "react";
import { MdDelete } from "react-icons/md";

interface RateChartTableProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<Array<Record<string, any>>>>;
  index: number;
}

const RateChartTable: React.FC<RateChartTableProps> = ({
  data,
  setData,
  index,
}) => {
  const fields = [
    "_order_design_id",
    "category",
    "sub_category",
    "sv_ln",
    "breadth",
    "depth",
    "quantity",
    "pm_pointer",
    "wt",
    "lme_rate",
    "sales_rate",
    "qw",
    "sales_value",
    "production_quantity",
    "production_weight",
    "setting",
    "setting_rate",
    "setting_value",
    "alloy",
    "alloy_rate",
    "wset",
    "h_set",
    "sshp",
    "m_material",
    "Delete",
  ];

  const formatFieldLabel = (field: string) => {
    return field
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleCellChange = (
    rowIndex: number,
    fieldName: string,
    value: string
  ) => {
    console.log(data.order_design[index].rate_chart[rowIndex], "data");
    setData((prev: any) => {
      const updatedOrderDesign = [...prev.order_design];
      const design = { ...updatedOrderDesign[index] };
      const updatedRateChart = [...design.rate_chart];
      updatedRateChart[rowIndex] = {
        ...updatedRateChart[rowIndex],
        [fieldName]: value,
        _is_updated: 1,
      };
      design.rate_chart = updatedRateChart;
      updatedOrderDesign[index] = design;
      return {
        ...prev,
        order_design: updatedOrderDesign,
      };
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
    _is_new: 1,
  };

  const addRow = () => {
    setData((prev: any) => {
      const updatedOrderDesign = [...prev.order_design];
      const designIndex = index;

      if (designIndex >= 0 && designIndex < updatedOrderDesign.length) {
        const currentDesign = { ...updatedOrderDesign[designIndex] };
        if (!currentDesign.rate_chart) {
          currentDesign.rate_chart = [];
        }
        if (!currentDesign.labour_chart) {
          currentDesign.labour_chart = [];
        }

        currentDesign.rate_chart = [
          ...currentDesign.rate_chart,
          initailDataRateChart,
        ];
        // currentDesign.labour_chart = [
        //   ...currentDesign.labour_chart,
        //   initialDataLabourChart,
        // ];
        updatedOrderDesign[designIndex] = currentDesign;
      }

      return {
        ...prev,
        order_design: updatedOrderDesign,
      };
    });
  };

  const handleDelete = (rowIndex: number) => {
    // Create a shallow copy of the order design array
    const updatedOrderDesign = [...data.order_design];
    const designIndex = index;

    // Ensure the design index is valid
    if (designIndex >= 0 && designIndex < updatedOrderDesign.length) {
      const currentDesign = updatedOrderDesign[designIndex];

      if (
        currentDesign.rate_chart &&
        rowIndex >= 0 &&
        rowIndex < currentDesign.rate_chart.length
      ) {
        const row = currentDesign.rate_chart[rowIndex];
        if (row._is_deleted === 1) {
          row._is_deleted = 0;
        } else {
          row._is_deleted = 1;
        }
        if (row._is_deleted === 1 && row._is_new === 1) {
          currentDesign.rate_chart.splice(rowIndex, 1);
        }
        updatedOrderDesign[designIndex] = currentDesign;
      }
    }

    setData((prev: any) => ({
      ...prev,
      order_design: updatedOrderDesign,
    }));
  };

  return (
    <div className="card shadow">
      <div className="d-flex justify-content-between">
        <h6 className="px-4 pt-2">Rate Chart</h6>
        <div className="px-4 py-1">
          <button className="btn btn-success fs-10" onClick={addRow}>
            Add
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field} className="fs-10">
                  {formatFieldLabel(field)}
                </th>
              ))}
              <th className="fs-10">Actions</th> {/* Add actions column */}
            </tr>
          </thead>
          <tbody>
            {data?.order_design[index]?.rate_chart?.map(
              (row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {fields?.map((field) => (
                    <td key={field}>
                      {field === "_order_design_id" ? (
                        <input
                          type="number"
                          name={`order_design[${index}].rate_chart[${rowIndex}][${field}]`}
                          value={row[field] || ""}
                          readOnly
                          className="form-control fs-10"
                        />
                      ) : (
                        <input
                          style={{ minWidth: "60px" }}
                          type={
                            [
                              "breadth",
                              "depth",
                              "quantity",
                              "wt",
                              "lme_rate",
                              "sales_rate",
                              "qw",
                              "sales_value",
                              "production_quantity",
                              "production_weight",
                              "setting_rate",
                              "setting_value",
                              "alloy_rate",
                              "wset",
                              "h_set",
                              "sshp",
                            ].includes(field)
                              ? "number"
                              : "text"
                          }
                          name={`order_design[${index}].rate_chart[${rowIndex}][${field}]`}
                          value={row[field] || ""}
                          onChange={(e) =>
                            handleCellChange(rowIndex, field, e.target.value)
                          }
                          className="form-control fs-10"
                        />
                      )}
                    </td>
                  ))}
                  <td>
                    <span
                      onClick={() => handleDelete(rowIndex)}
                      style={{
                        cursor: "pointer",
                        color: row._is_delete === 1 ? "blue" : "red",
                      }}
                    >
                      <MdDelete />
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RateChartTable;
