import React, { useState } from "react";

type Props = {};

const FormPage = (props: Props) => {
  const formDataConfig: any = {
    main: {
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
      },
      rate_chart: {
        label: "Rate Chart",
        type: "Table",
        name: "rate_chart",
        show: true,
        form: "RateChart",
        parentfield: "order_design",
        leve1: 2,
      },
    },

    OrderDesign: {
      design_code: {
        label: "Design Code",
        type: "text",
        name: "design_code",
        value: "",
        show: true,
      },
      category: {
        label: "Category",
        type: "text",
        name: "category",
        value: "",
        show: true,
      },

      Rate: {
        label: "Rate 1",
        type: "text",
        name: "category",
        value: "",
        show: true,
      },
      add: {
        label: "Add",
        type: "button",
        // onClick: () => handleAddChildRow,
        show: true,
      },
    },

    RateChart: {
      design_code: {
        label: "Design Code",
        type: "text",
        name: "design_code",
        value: "",
        show: true,
      },
      category: {
        label: "Category",
        type: "text",
        name: "category",
        value: "",
        show: true,
      },
      Rate: {
        label: "Rate 1",
        type: "text",
        name: "category",
        value: "",
        show: true,
      },
    },
  };

  const [tableRows, setTableRows] = useState<any>({
    order_design: [{}],
  });

  const handleAddRow = (tableName: string) => {
    setTableRows((prev: any) => ({
      ...prev,
      [tableName]: [...(prev[tableName] || []), {}],
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(formData.entries());
    console.log("Form Data JSON:", formObject);
  };

  const handleAddChildRow = (event: any) => {
    console.log(event);
  };

  const renderField = (field: any, tableName: string, index: number) => {
    if (!field.show) return null;
    if (field.type === "text") {
      const inputName = tableName
        ? `${tableName}[${index}][${field.name}]`
        : field.name;
      return (
        <input
          type={field.type}
          name={inputName}
          id={inputName}
          placeholder={field.label}
          className="form-control mb-2"
        />
      );
    }
    if (field.type === "button") {
      return (
        <button onClick={ handleAddChildRow}>{field.label}</button>
      );
    }
  };

  const renderTable = (table: any) => {
    if (!table.show || !formDataConfig[table.form]) return null;
    const tableFields = formDataConfig[table.form];
    const rows = tableRows[table.name] || [];

    return (
      <div>
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={() => handleAddRow(table.name)}
        >
          Add Row
        </button>
        <table className="table table-bordered">
          <thead>
            <tr>
              {Object.keys(tableFields).map((fieldKey) => (
                <th key={fieldKey}>{tableFields[fieldKey].label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {Object.keys(tableFields).map((fieldKey) => (
                  <td key={fieldKey}>
                    {renderField(tableFields[fieldKey], table.name, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            {Object.keys(formDataConfig.main).map((key: any) => {
              const field = formDataConfig.main[key];

              if (field.type === "text") {
                return (
                  <div key={key} className="form-group">
                    <label>{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.label}
                      className="form-control mb-2"
                    />
                  </div>
                );
              }
              if (field.type === "Table") {
                return (
                  <div key={key} className="mt-4">
                    <h5>{field.label}</h5>
                    {renderTable(field)}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-success mt-3">
        Submit
      </button>
    </form>
  );
};

export default FormPage;
