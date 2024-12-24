import React, { useState } from "react";

interface ModalFormProps {
  orderMasterId: number;
  onSubmit: (data: Record<string, any>) => void;
  onClose: () => void;
}

// Define the type for each field in initialData
type FieldType = 'number' | 'text' | 'checkbox' | 'date';

interface InitialData {
  [key: string]: {
    value: any;
    type: FieldType;
  };
}

const ModalForm: React.FC<ModalFormProps> = ({ orderMasterId, onSubmit, onClose }) => {
  const initialData: InitialData = {
    order_master_id: { value: orderMasterId, type: 'number' },
    multiply_by: { value: null, type: 'number' },
    mrp_multiply_by: { value: null, type: 'number' },
    fixed_price: { value: false, type: 'checkbox' },
    gold_as: { value: "", type: 'text' },
    lab_as: { value: "", type: 'text' },
    val_addn_cap: { value: null, type: 'number' },
    all_wts_from_ord: { value: false, type: 'checkbox' },
    wts_from_ord: { value: null, type: 'number' },
    gld_rz_from_ord: { value: false, type: 'checkbox' },
    chg_per_on_wst: { value: false, type: 'checkbox' },
    lab_wt_from_ord: { value: false, type: 'checkbox' },
    lab_wait_for_all_bags: { value: false, type: 'checkbox' },
    lmg_cost: { value: null, type: 'number' },
    lmg_date: { value: null, type: 'date' },
    lmp_cost: { value: null, type: 'number' },
    lmp_date: { value: null, type: 'date' },
    lms_cost: { value: 0.00, type: 'number' },
    lms_date: { value: null, type: 'date' },
    lml_cost: { value: 0.00, type: 'number' },
    lml_date: { value: null, type: 'date' },
    orig_exp_del_dt: { value: null, type: 'date' },
    orig_prd_del_dt: { value: null, type: 'date' },
    person: { value: "", type: 'text' },
    contractor: { value: "", type: 'text' },
    del_terms: { value: "", type: 'text' },
    pay_terms: { value: "", type: 'text' },
    special_remarks: { value: "", type: 'text' },
    ret_memo_inp1: { value: "", type: 'text' },
    ret_memo_inp2: { value: "", type: 'text' },
    ret_memo_inp3: { value: "", type: 'text' },
    po_cust_date: { value: null, type: 'date' },
    cust_req_dt: { value: null, type: 'date' },
    rev_date1: { value: null, type: 'date' },
    rev_date2: { value: null, type: 'date' },
    prod_line: { value: "", type: 'text' },
    wax_set_dia_dt: { value: null, type: 'date' },
    hard_set_dia_dt: { value: null, type: 'date' },
    rm_rate_lookup: { value: 0.00, type: 'number' },
    lab_rate_lookup: { value: 0.00, type: 'number' },
    metal_loss: { value: 0.00, type: 'number' },
    cust_ctg: { value: "", type: 'text' },
    cust_cd: { value: "", type: 'text' },
    yyyymm: { value: null, type: 'date' },
  };

  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  console.log({formData})

  const formatFieldLabel = (field: string) => {
    return field
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const { type, value, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], value: updatedValue },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = Object.keys(formData).reduce((acc, field) => {
      acc[field] = formData[field].value;
      return acc;
    }, {} as Record<string, any>);
    onSubmit(formattedData);
  };

  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog" style={{ maxWidth: "80%" }}>
        <div className="modal-content">
          <div className="modal-header" style={headerStyle}>
            <h5 className="modal-title" style={headerTextStyle}>
              Edit Order Details
            </h5>
            <button type="button" className="close" onClick={onClose} style={closeButtonStyle}>
              <span>&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row p-4 g-2">
                {Object.keys(formData).map((field) => {
                  const { value, type } = formData[field];
                  const label = formatFieldLabel(field);
                  let inputElement;

                  if (type === "number") {
                    inputElement = (
                      <input
                        type="number"
                        value={value || ""}
                        onChange={(e) => handleInputChange(e, field)}
                        className="form-control"
                      />
                    );
                  } else if (type === "checkbox") {
                    inputElement = (
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange(e, field)}
                        className="m-2 d-block"
                      />
                    );
                  } else if (type === "date") {
                    inputElement = (
                      <input
                        type="date"
                        value={value ? value.toString().substring(0, 10) : ""}
                        onChange={(e) => handleInputChange(e, field)}
                        className="form-control w-100"
                      />
                    );
                  } else {
                    inputElement = (
                      <input
                        type="text"
                        value={value || ""}
                        onChange={(e) => handleInputChange(e, field)}
                        className="form-control"
                      />
                    );
                  }

                  return (
                    <div className="col-md-4 col-lg-3" key={field}>
                      <div className="mb-2">
                        <label htmlFor={field} className="form-label">
                          {label}
                        </label>
                        {inputElement}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Custom Styles for Modal Header and Close Button
const headerStyle = {
  backgroundColor: "#007bff",
  color: "white",
  borderBottom: "1px solid #ddd",
  padding: "15px 20px",
};

const headerTextStyle = {
  fontSize: "1.25rem",
  fontWeight: "bold",
};

const closeButtonStyle = {
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "1.5rem",
};

export default ModalForm;
