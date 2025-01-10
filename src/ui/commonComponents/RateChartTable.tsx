import React from "react";

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
      };
      design.rate_chart = updatedRateChart;
      updatedOrderDesign[index] = design;
      return {
        ...prev,
        order_design: updatedOrderDesign,
      };
    });
  };

  return (
    <div className="card shadow">
      <div className="">
        <h6 className="px-4 pt-2">Rate Chart</h6>
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
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RateChartTable;
