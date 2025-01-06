import React, { useEffect, useRef, useState } from "react";
import { First } from "react-bootstrap/esm/PageItem";
import DropdownList from "./DropdownList";

type Props = {};

const AutoCompleteDropDown = ({
  field,
  formValues,
  // setFormValues,
  fieldName,
  updateStateFunction,
  defaultValue = "",
  handleOnSelect,
}: any) => {
  interface Customer {
    customer_id: number;
    customer_name: string;
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState(null);
  const [tableHead, setTableHead] = useState<any>({});
  const [tableData, setTableData] = useState<any>({});
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
      const nextIndex =
        focusedIndex === null || focusedIndex === filteredCustomers.length - 1
          ? 0
          : focusedIndex + 1;

      const nextCustomer = filteredCustomers[nextIndex];
      if (nextCustomer) {
        setFilter(nextCustomer[field.name]);
        updateStateFunction(nextCustomer[field.name], field);

        // Ensure the focused row is visible
        const row = document.querySelector(`tr:nth-child(${nextIndex + 1})`);
        row?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) =>
        prevIndex === null || prevIndex === 0
          ? filteredCustomers.length - 1
          : prevIndex - 1
      );
      const prevIndex =
        focusedIndex === null || focusedIndex === 0
          ? filteredCustomers.length - 1
          : focusedIndex - 1;

      const prevCustomer = filteredCustomers[prevIndex];
      if (prevCustomer) {
        setFilter(prevCustomer[field.name]);
        updateStateFunction(prevCustomer[field.name], field);

        // Ensure the focused row is visible
        const row = document.querySelector(`tr:nth-child(${prevIndex + 1})`);
        row?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
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
      const res3 = await window.electron.triggerFunction({
        path: res2.autoCompleteFields.order_id.onSelect.fetchFullForm,
        inputs: {},
      });
      console.log(res2, "Fetching");
      console.log(res3, "Fetching new");
      setTableData(res2.autoCompleteFields[field.name]);
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
    console.log(formValues, "target value");
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
    console.log("updateStateFunction called", customer, field);
  };

  const handleBlur = (
    field: any,
    filter: any,
    setFilter: any,
    setIsDropdownOpen: any,
    setFocusedIndex: any
  ) => {
    if (!filter) {
      setFilter(null);
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
          className="form-control fs-10"
          value={filter !== null ? filter : defaultValue}
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
            console.log("on focus");
            setFilter(null);
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
          onBlur={(e) => {
            console.log("on blur", filteredCustomers);
            setIsDropdownOpen(false);

            const filteredValue =
              (filteredCustomers.length > 0 &&
                filteredCustomers.filter(
                  (item) => item[field.name] === Number(filter)
                )) ||
              [];

            if (filteredValue?.length > 0) {
              setFilter((prev: any) => prev);
              updateStateFunction(filteredValue, field);
              handleOnSelect(tableData, filteredValue);
            } else {
              setFilter(null);
            }
          }}
          placeholder={`Search ${field.label}`}
          onKeyDown={handleKeyDown}
        />
        {isDropdownOpen && (
          <DropdownList
            items={filteredCustomers}
            focusedIndex={focusedIndex}
            onSelect={(e, customer) => {
              e.stopPropagation();
              handleSelectRow(customer, setFilter, setIsDropdownOpen, field);
            }}
            tableHead={tableHead}
          />
        )}
        {/* {isDropdownOpen && (
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRow(
                            customer,
                            setFilter,
                            setIsDropdownOpen,
                            field
                          );
                        }}
                        className={focusedIndex === idx ? "table-primary" : ""}
                        onMouseEnter={() => {
                          setFocusedIndex(idx);
                          console.log("updateStateFunction called again");
                        }}
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
        )} */}
      </div>
    </div>
  );
};

export default AutoCompleteDropDown;
