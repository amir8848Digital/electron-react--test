import React, { useState } from "react";

const formStructure = {
  voucher_part1: {
    label: "Voucher Part 1",
    type: "text",
    name: "voucher_part1",
    value: "",
    show: true,
  },
  order_design: {
    label: "Order Design",
    type: "Table",
    name: "order_design",
    show: true,
    form: "OrderDesign",
    leve1: 1,
    columns: ["Field 1", "Field 2", "Field 3"],
  },
  rate_chart: {
    label: "Rate Chart",
    type: "Table",
    name: "rate_chart",
    show: true,
    form: "RateChart",
    parentfield: "order_design",
    leve1: 2,
    columns: ["Rate", "Description", "Quantity"],
  },
};

const FormPage = () => {
  const [formData, setFormData] = useState(
    Object.keys(formStructure).reduce((acc, key) => {
      if (formStructure[key].type === "Table") {
        acc[key] = []; // Initialize table data as an array
      } else {
        acc[key] = formStructure[key].value || "";
      }
      return acc;
    }, {})
  );

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTableChange = (tableName, rowIndex, column, value) => {
    setFormData((prev) => {
      const updatedTable = [...prev[tableName]];
      updatedTable[rowIndex] = {
        ...updatedTable[rowIndex],
        [column]: value,
      };
      return {
        ...prev,
        [tableName]: updatedTable,
      };
    });
  };

  const addTableRow = (tableName) => {
    setFormData((prev) => ({
      ...prev,
      [tableName]: [...prev[tableName], {}], // Add an empty row
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", JSON.stringify(formData, null, 2));
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(formStructure).map(([key, config]) => {
        if (!config.show) return null;

        if (config.type === "text") {
          return (
            <div key={key}>
              <label htmlFor={key}>{config.label}</label>
              <input
                type="text"
                id={key}
                name={config.name}
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          );
        }

        if (config.type === "Table") {
          return (
            <div key={key}>
              <label>{config.label}</label>
              <table border="1">
                <thead>
                  <tr>
                    {config.columns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData[key].map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {config.columns.map((col) => (
                        <td key={col}>
                          <input
                            type="text"
                            value={row[col] || ""}
                            onChange={(e) =>
                              handleTableChange(
                                key,
                                rowIndex,
                                col,
                                e.target.value
                              )
                            }
                          />
                        </td>
                      ))}
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const updatedTable = [...prev[key]];
                              updatedTable.splice(rowIndex, 1); // Remove the row
                              return {
                                ...prev,
                                [key]: updatedTable,
                              };
                            });
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={() => addTableRow(key)}>
                Add Row
              </button>
            </div>
          );
        }

        return null;
      })}

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormPage;
