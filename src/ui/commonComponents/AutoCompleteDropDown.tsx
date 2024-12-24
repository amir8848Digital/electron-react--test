import React, { useEffect, useRef, useState } from "react";
import { First } from "react-bootstrap/esm/PageItem";

type Props = {};

const AutoCompleteDropDown = ({
  field,
  formValues,
  setFormValues,
  fieldName,
  updateStateFunction,
}: any) => {
  interface Customer {
    customer_id: number;
    customer_name: string;
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState("");
  const [tableHead, setTableHead] = useState<any>({});
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        setFilter(nextCustomer[field.name]);
        // setFormValues({
        //   ...formValues,
        //   [field.name]: nextCustomer.customer_id,
        // });
        updateStateFunction(nextCustomer[field.name], field);
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
        setFilter(prevCustomer[field.name]);
        updateStateFunction(prevCustomer[field.name], field);
      }
    } else if (e.key === "Enter" && focusedIndex !== null) {
      handleSelectRow(
        filteredCustomers[focusedIndex],
        setFilter,
        setIsDropdownOpen,
        field
      );
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setFocusedIndex(0);
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        // handleBlur(
        //   field,
        //   filter,
        //   setFilter,
        //   setFormValues,
        //   setIsDropdownOpen,
        //   setFocusedIndex
        // );
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filteredCustomers, filter]);

  useEffect(() => {
    const fetch = async () => {
      console.log({ fieldName });
      const res2 = await window.electron.getFormConfig(`${fieldName}`);
      setTableHead(res2.autoCompleteFields[field.name].fieldsMap);
    };
    fetch();
  }, []);

  const handleFilterChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
    fieldName: any,
    isDropdownOpen: any,
    setIsDropdownOpen: any,
    setFilter: any,
    setFilteredCustomers: any
  ) => {
    setIsDropdownOpen(true);
    setFilter(e.target.value);
    const res = await window.electron.getAutoCompleteData({
      formName: fieldName,
      fieldname: field.name,
      value: e.target.value,
    });
    updateStateFunction(e.target.value, field);
    setFilteredCustomers(res);
  };

  const handleSelectRow = (
    customer: any,
    setFilter: any,
    setIsDropdownOpen: any,
    field: any
  ) => {
    setFilter(customer[field.name]);
    setIsDropdownOpen(false);
    updateStateFunction(customer[field.name], field);
    setIsDropdownOpen(false);
  };

  const handleBlur = (
    field: any,
    filter: any,
    setFilter: any,
    setFormValues: any,
    setIsDropdownOpen: any,
    setFocusedIndex: any
  ) => {
    if (!filter) {
      setFilter("");
      updateStateFunction("", field);
    }
    setIsDropdownOpen(false);
    setFocusedIndex(0);
  };

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
            handleFilterChange(
              e,
              field,
              fieldName,
              isDropdownOpen,
              setIsDropdownOpen,
              setFilter,
              setFilteredCustomers
            )
          }
          onFocus={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsDropdownOpen(true);
            setFilter("");
            handleFilterChange(
              e,
              field,
              fieldName,
              isDropdownOpen,
              setIsDropdownOpen,
              setFilter,
              setFilteredCustomers
            );
          }}
          placeholder={`Search ${field.label}`}
          onKeyDown={handleKeyDown}
        />
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="dropdown-menu show overflow-auto"
            id="drop"
            style={{ maxHeight: "200px", display: "blck", overflowY: "auto" }}
          >
            <table
              className="table table-hover mb-0"
              style={{ fontSize: "12px" }}
            >
              <thead>
                <tr>
                  {Object.keys(tableHead).map((key) => (
                    <th>{tableHead[key]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCustomers?.length > 0 &&
                  filteredCustomers?.map((customer: any, idx: number) => {
                    return (
                      <tr
                        key={idx}
                        onClick={() =>
                          handleSelectRow(
                            customer,
                            setFilter,
                            setIsDropdownOpen,
                            field
                          )
                        }
                        className={focusedIndex === idx ? "table-primary" : ""}
                        onMouseEnter={() => setFocusedIndex(idx)}
                      >
                        {Object.keys(tableHead).map((key) => (
                          <td key={key}>{customer[key]}</td>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoCompleteDropDown;
