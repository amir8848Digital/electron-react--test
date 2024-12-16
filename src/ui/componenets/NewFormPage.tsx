import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete"; // Import AutoComplete component

const NewFormPage = () => {
  interface FormValues {
    [key: string]: string | Date | null;
  }
  interface Customer {
    customer_id: number;
    customer_name: string;
  }

  const fields = [
    { label: "Voucher", name: "voucher", type: "text" },
    { label: "Date", name: "date", type: "calendar" },
    { label: "Currency", name: "currency", type: "text" },
    { label: "Customer ID", name: "customerID", type: "autoComplete" },
    { label: "Customer Name", name: "customerName", type: "text" },
    { label: "Conversion Factor", name: "convFact", type: "text" },
    { label: "Conversion Date", name: "convDate", type: "calendar" },
    { label: "LMG Sales", name: "LMGSales", type: "text" },
    { label: "LMP Sales", name: "LMPSales", type: "text" },
    { label: "LMS Sales", name: "LMSales", type: "text" },
    { label: "LML Sales", name: "LMLSales", type: "text" },
    { label: "CHI X KT", name: "CHIXKT", type: "text" },
    { label: "PO Number", name: "PONumber", type: "text" },
    { label: "PO Date", name: "PODate", type: "calendar" },
    { label: "Priority", name: "priority", type: "text" },
    { label: "EXP Delivery Date", name: "expDelDate", type: "calendar" },
    { label: "Product Delivery Date", name: "prodDelDate", type: "calendar" },
    { label: "Order Lock", name: "ordLock", type: "text" },
    { label: "Password", name: "pwd", type: "text" },
    { label: "LK Sales Price", name: "LKSalesPrice", type: "text" },
    { label: "Refresh Date", name: "refreshDate", type: "calendar" },
  ];

  const initialState: FormValues = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "calendar" ? null : "";
    return acc;
  }, {} as FormValues);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [formValues, setFormValues] = useState<FormValues>(initialState);
  const [customerID, setCustomerID] = useState<string>(""); // State for AutoComplete value
  const [customers, setCustomers] = useState<any[]>([]); // List of customers
  const [filter, setFilter] = useState("");
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(customers);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to detect click outside
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormValues({
      ...formValues,
      [name]: e.target.value,
    });
  };

  const handleCalendarChange = (e: any, name: string) => {
    setFormValues({
      ...formValues,
      [name]: e.value,
    });
  };

  // AutoComplete search method

  useEffect(() => {
    const fetchCustomerData = async () => {
      // Assuming window.electron.getStaticData() fetches customer data
      const res = await window.electron.getStaticData();
      console.log(res); // Log to verify the data structure
      setCustomers(res); // Set fetched customers
      setFilteredCustomers(res); // Initially show all customers in AutoComplete
    };
    fetchCustomerData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    const filtered = customers.filter((customer) =>
      customer.customer_name
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  // Handle outside click to close the dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selecting a customer
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFilter(customer.customer_name);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) =>
        prevIndex === null || prevIndex === filteredCustomers.length - 1
          ? 0
          : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) =>
        prevIndex === null || prevIndex === 0
          ? filteredCustomers.length - 1
          : prevIndex - 1
      );
    } else if (e.key === "Enter" && focusedIndex !== null) {
      handleSelectCustomer(filteredCustomers[focusedIndex]);
    }
  };
  const handleClick = () => {
    console.log({ formValues });
  };
  return (
    <div className="container">
      <div className="card p-4">
        <form className="grid">
          {fields.map((field, index) => (
            <div className="col-4" key={index}>
              {" "}
              {/* Apply col-4 class to each field */}
              <div className="p-fluid formgrid">
                <div>
                  <label htmlFor={field.name}>{field.label}</label>
                </div>
                {field.type === "text" && (
                  <InputText
                    id={field.name}
                    value={formValues[field.name] as string}
                    onChange={(e) => handleChange(e, field.name)}
                  />
                )}
                {field.type === "calendar" && (
                  <Calendar
                    id={field.name}
                    value={formValues[field.name] as Date | null}
                    onChange={(e) => handleCalendarChange(e, field.name)}
                    dateFormat="dd/mm/yy"
                  />
                )}
                {field.type === "autoComplete" && (
                  <div className="custom-dropdown-container p-fluid formgrid">
                    <label htmlFor="customer"></label>
                    <div className="input-container">
                      <input
                        ref={inputRef}
                        type="text"
                        id="customer"
                        value={filter}
                        onChange={handleFilterChange}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Search customer"
                        onKeyDown={handleKeyDown}
                      />
                      {isDropdownOpen && (
                        <div ref={dropdownRef} className="dropdown">
                          <table className="dropdown-table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCustomers.map((customer, index) => (
                                <tr
                                  key={customer.customer_id}
                                  onClick={() => handleSelectCustomer(customer)}
                                  className={
                                    focusedIndex === index ? "highlighted" : ""
                                  }
                                  onMouseEnter={() => setFocusedIndex(index)} // Optional: highlight on mouse hover
                                >
                                  <td>{customer.customer_id}</td>
                                  <td>{customer.customer_name}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </form>
        <div>
          <Button
            label="Submit"
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default NewFormPage;
