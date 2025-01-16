import React from "react";
import { MdDelete } from "react-icons/md";
interface LabourChartTableProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<Array<Record<string, any>>>>;
  index: number;
  setOrderMaster: any;
}

const LabourChartTable: React.FC<LabourChartTableProps> = ({
  data,
  setData,
  index,
  setOrderMaster,
}) => {
  const fields = [
    "_order_design_id",
    "main_cd",
    "sub_cd",
    "by_qw",
    "quantity",
    "rate",
    "value",
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
    setData((prev: any) => {
      const updatedOrderDesign = [...prev.order_design];
      const design = { ...updatedOrderDesign[index] };
      const updatedRateChart = [...design.labour_chart];
      updatedRateChart[rowIndex] = {
        ...updatedRateChart[rowIndex],
        [fieldName]: value,
        _is_updated: 1,
      };
      design.labour_chart = updatedRateChart;
      updatedOrderDesign[index] = design;
      return {
        ...prev,
        order_design: updatedOrderDesign,
      };
    });
  };

  const initialDataLabourChart = {
    _order_design_id: null,
    maind_cd: "",
    sub_cd: "",
    by_qw: 0,
    quantity: 0,
    rate: 0,
    value: 0,
    formName: "orderLabourChart",
    _is_new: 1,
  };

  const addRow = () => {
    setOrderMaster((prev: any) => {
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
        currentDesign.labour_chart = [
          ...currentDesign.labour_chart,
          initialDataLabourChart,
        ];
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
        currentDesign.labour_chart &&
        rowIndex >= 0 &&
        rowIndex < currentDesign.labour_chart.length
      ) {
        const row = currentDesign.labour_chart[rowIndex];
        if (row._is_deleted === 1) {
          row._is_deleted = 0;
        } else {
          row._is_deleted = 1;
        }
        if (row._is_deleted === 1 && row._is_new === 1) {
          currentDesign.labour_chart.splice(rowIndex, 1);
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
        <h6 className="px-4 pt-2">Labour Chart</h6>
        <div className="px-4 py-1">
          <button className="btn btn-success fs-10" onClick={addRow}>
            Add
          </button>
        </div>
      </div>
      <div className="table-responsive">
        {
          <table className="table table-bordered">
            <thead>
              <tr>
                {fields.map((field) => (
                  <th key={field} className="fs-10">
                    {formatFieldLabel(field)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.order_design[index]?.labour_chart?.map(
                (row: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {fields.map((field) => (
                      <td key={field}>
                        {field === "_order_design_id" ? (
                          // Read-only field for order_design_id
                          <input
                            type="number"
                            name={`
                              order_design[${index}].labour_chart[${rowIndex}][
                                ${field}
                              ]
                            }`}
                            value={row[field] || ""}
                            readOnly
                            className="form-control  fs-10 "
                          />
                        ) : (
                          <input
                            type={
                              ["quantity", "rate", "value"].includes(field)
                                ? "number"
                                : "text"
                            }
                            name={`
                              order_design[${index}].labour_chart[${rowIndex}][
                                ${field}
                              ]
                            }`}
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
        }
      </div>
    </div>
  );
};

export default LabourChartTable;
