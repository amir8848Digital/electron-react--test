import React from "react";

interface LabourChartTableProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<Array<Record<string, any>>>>;
  index: number;
}

const LabourChartTable: React.FC<LabourChartTableProps> = ({
  data,
  setData,
  index,
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
      };
      design.labour_chart = updatedRateChart;
      updatedOrderDesign[index] = design;
      return {
        ...prev,
        order_design: updatedOrderDesign,
      };
    });
  };

  return (
    <div className="card shadow">
      <div className="p-2 mb-0">
        <h6 className="px-4 pt-2">Labour Chart</h6>
      </div>
      <div className="table-responsive">
        {data?.order_design[index]?.labour_chart?.length > 0 ? (
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
                            value={row[field] || ""}
                            onChange={(e) =>
                              handleCellChange(rowIndex, field, e.target.value)
                            }
                            className="form-control"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default LabourChartTable;
