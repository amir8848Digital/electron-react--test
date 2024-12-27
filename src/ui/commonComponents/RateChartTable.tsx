import React from "react";

interface RateChartTableProps {
  data: Array<Record<string, any>>;
  setData: React.Dispatch<React.SetStateAction<Array<Record<string, any>>>>;
}

const RateChartTable: React.FC<RateChartTableProps> = ({ data, setData }) => {
  const fields = [
    "order_design_id",
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

    // Convert the field values to numbers for numeric fields
    if (
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
      ].includes(fieldName)
    ) {
      updatedData[rowIndex][fieldName] = parseFloat(value) || 0;
    } else {
      updatedData[rowIndex][fieldName] = value;
    }

    setData(updatedData);
  };

  return (
    <div className="card shadow">
      <div className="">
        <h6>Rate Chart</h6>
      </div>
      <div className="table-responsive">
        {data?.length > 0 ? (
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
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {fields.map((field) => (
                    <td key={field}>
                      {field === "order_design_id" ? (
                        <input
                          type="number"
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
                          value={row[field] || ""}
                          onChange={(e) =>
                            handleCellChange(rowIndex, field, e.target.value)
                          }
                          className="form-control fs-10"
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

export default RateChartTable;
