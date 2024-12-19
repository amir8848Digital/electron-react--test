import React, { useEffect, useRef, useState } from "react";

type Props = {};

const AutoCompleteDropDown = ({
  field,
  formValues,
  setFormValues,
  fieldName,
}: any) => {
  interface Customer {
    customer_id: number;
    customer_name: string;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldname: string
  ) => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
    setFilter(e.target.value);
    const res = await window.electron.getAutoCompleteData({
      formName: fieldName,
      fieldname: field.name,
      value: e.target.value,
    });
    setFilteredCustomers(res);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setFilter(customer.customer_name);
    setIsDropdownOpen(false);
    setFormValues({ ...formValues, [field.name]: customer.customer_id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) =>
        prevIndex === null || prevIndex === filteredCustomers.length - 1
          ? 0
          : prevIndex + 1
      );
      const nextCustomer =
        filteredCustomers[
          focusedIndex === null || focusedIndex === filteredCustomers.length - 1
            ? 0
            : focusedIndex + 1
        ];
      if (nextCustomer) {
        setFilter(nextCustomer.customer_name);
        setFormValues({
          ...formValues,
          [field.name]: nextCustomer.customer_id,
        });
      }
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) =>
        prevIndex === null || prevIndex === 0
          ? filteredCustomers.length - 1
          : prevIndex - 1
      );
      const prevCustomer =
        filteredCustomers[
          focusedIndex === null || focusedIndex === 0
            ? filteredCustomers.length - 1
            : focusedIndex - 1
        ];
      if (prevCustomer) {
        setFilter(prevCustomer.customer_name);
        setFormValues({
          ...formValues,
          [field.name]: prevCustomer.customer_id,
        });
      }
    } else if (e.key === "Enter" && focusedIndex !== null) {
      handleSelectCustomer(filteredCustomers[focusedIndex]);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setFocusedIndex(0);
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // Move focus to the next/previous input
      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement>("input")
      );
      const currentIndex = inputs.findIndex(
        (input) => input === inputRef.current
      );
      const nextIndex =
        e.key === "ArrowRight"
          ? currentIndex + 1
          : e.key === "ArrowLeft"
          ? currentIndex - 1
          : currentIndex;

      if (inputs[nextIndex]) {
        inputs[nextIndex].focus();
      }
    }
  };

  const handleBlur = () => {
    if (!filter) {
      setFilter("");
      setFormValues({ ...formValues, [field.name]: "" });
    }
    setIsDropdownOpen(false);
    setFocusedIndex(0);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        handleBlur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filteredCustomers, filter]);

  return (
    <div>
      <div className="position-relative">
        <input
          ref={inputRef}
          type="text"
          id={field.name}
          className="form-control"
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFilterChange(e, field.name)
          }
          onFocus={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsDropdownOpen(true);
            setFilter("");
            handleFilterChange(e, field.name);
          }}
          onBlur={handleBlur}
          placeholder={`Search ${field.label}`}
          onKeyDown={handleKeyDown}
        />
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="dropdown-menu w-100 show overflow-auto"
            id="drop"
            style={{ maxHeight: "200px", display: "block" }}
          >
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers?.length > 0 &&
                  filteredCustomers.map((customer: any, idx: number) => (
                    <tr
                      key={customer.customer_id}
                      onClick={() => handleSelectCustomer(customer)}
                      className={focusedIndex === idx ? "table-primary" : ""}
                      onMouseEnter={() => setFocusedIndex(idx)}
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
  );
};

export default AutoCompleteDropDown;
