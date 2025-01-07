import React from "react";

type Props = {};

const FormPage = (props: Props) => {
  const formData: any = {
    main: {
      voucher_part1: {
        label: "Voucher Part 1",
        type: "text",
        name: "voucher_part1",
        value: "",
        show: true,
      },
      voucher_part4: {
        label: "Voucher Part 4",
        type: "autocomplete",
        name: "voucher_part4",
        value: "",
        show: true,
      },
      order_design: {
        label: "Order Design",
        type: "Table",
        name: "order_design",
        show: true,
        form: "OrderDesign",
      },
      rate_chart: {
        label: "Rate Chart",
        type: "Table",
        name: "rate_chart",
        show: true,
        form: "rateChart",
        parent_field: "order_design",
      },
      labour_chart: {
        label: "Labour Chart",
        type: "Table",
        name: "labour_chart",
        show: true,
        form: "labourChart",
        parent_field: "order_design",
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
    },
  };

  // Function to render form fields
  const renderField = (field: any) => {
    if (!field.show) return null;

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            name={field.name}
            placeholder={field.name}
            className="form-control mb-2"
          />
        );
      case "dropdown":
        return (
          <select name={field.name} className="form-control mb-2">
            <option value="">Select {field.name}</option>
            {/* Add options dynamically if needed */}
          </select>
        );
      default:
        return null;
    }
  };

  // Function to render a table
  const renderTable = (table: any) => {
    if (!table.show || !formData[table.form]) return null;

    const tableFields = formData[table.form];
    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            {Object.keys(tableFields).map((fieldKey) => (
              <th key={fieldKey}>{fieldKey}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(tableFields).map((fieldKey) => (
              <td key={fieldKey}>{renderField(tableFields[fieldKey])}</td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="container" id="form">
      <div className="row">
        <div className="col-12">
          {Object.keys(formData.main).map((key: any) => {
            const field = formData.main[key];

            if (field.type === "text") {
              return (
                <div key={key} className="form-group">
                  <label>{field.name}</label>
                  {renderField(field)}
                </div>
              );
            }

            if (field.type === "Table") {
              return (
                <div key={key} className="mt-4">
                  <h5>{field.name}</h5>
                  {renderTable(field)}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
