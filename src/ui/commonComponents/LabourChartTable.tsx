import React from "react";

interface LabourChartTableProps {
  data: Array<Record<string, any>>;
  setData: React.Dispatch<React.SetStateAction<Array<Record<string, any>>>>;
}

const LabourChartTable: React.FC<LabourChartTableProps> = ({
  data,
  setData,
}) => {
  const fields = [
    "order_design_id",
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
    const updatedData = [...data];

    // Convert value to number if the field is numeric
    if (["by_qw","quantity", "rate", "value"].includes(fieldName)) {
      updatedData[rowIndex][fieldName] = parseFloat(value) || 0;
    } else {
      updatedData[rowIndex][fieldName] = value;
    }

    setData(updatedData);
  };

  return (
    <div className="card shadow">
      <div className="p-4">
        <h6>Labour Chart</h6>
      </div>
      <div className="table-responsive">
        {data?.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                {fields.map((field) => (
                  <th key={field}>{formatFieldLabel(field)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {fields.map((field) => (
                    <td key={field}>
                      {field === "order_design_id" ? (
                        // Read-only field for order_design_id
                        <input
                          type="number"
                          value={row[field] || ""}
                          readOnly
                          className="form-control"
                        />
                      ) : (
                        <input
                          type={["quantity", "rate", "value"].includes(field) ? "number" : "text"}
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
              ))}
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
