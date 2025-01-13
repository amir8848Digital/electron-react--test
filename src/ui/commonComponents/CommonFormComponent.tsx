import React, { useEffect, useState } from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";
import { formatToYYYYMMDD } from "../utils/commonFunctions";
import { First } from "react-bootstrap/esm/PageItem";

type Props = {};

const CommonFormComponent = ({
  formMainObj,
  orderMaster,
  setOrderMaster,
}: any) => {
  interface FormValues {
    [key: string]: string | Date | null | Date | number;
  }

  const stateUpdater = (name: any, value: any) => {
    setOrderMaster((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    stateUpdater(name, e.target.value);
  };

  const handleChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    stateUpdater(name, parseFloat(e.target.value));
  };

  const handleCalendarChange = (e: any, name: string) => {
    stateUpdater(name, e.target.value);
  };

  const updateStateFunction = (value: any, field: any) => {
    let values = { ...orderMaster };
    console.log(value, field, "value");
    if (field.type === "autoComplete") {
      values = { ...values, [field.name]: Number(value) };
    } else {
      values = { ...values, [field.name]: value };
    }
    console.log(values, "values");

    setOrderMaster((prev: any) => ({
      ...prev,
      ...values,
    }));
  };

  const handleOnSelect = async (data: any, value: any, field: any) => {
    console.log(data, value, field, "onSelect");
    if (data.onSelect) {
      if (data?.onSelect?.fetchFullForm) {
        const res = await window.electron.triggerFunction({
          path: data.onSelect.fetchFullForm,
          inputs: { value },
        });
        setOrderMaster({ ...res.data, _is_new: 0 });
      }
    }
  };

  return (
    <form>
      <div className="row p-4 g-2">
        {formMainObj?.fields?.map((field: any, index: number) => (
          <div className="col-md-2" key={index}>
            {field.type === "text" && (
              <div className="">
                <label id={field?.name} className="form-label fs-10">
                  {field?.label}
                </label>
                <input
                  type="text"
                  className="form-control  fs-10"
                  value={orderMaster[field?.name] as string}
                  onChange={(e) => handleChange(e, field.name)}
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            )}
            {field.type === "number" && (
              <div className="">
                <label htmlFor={field?.name} className="form-label fs-10">
                  {field?.label}
                </label>
                <input
                  type="number"
                  id={field?.name}
                  className="form-control fs-10"
                  value={orderMaster[field.name]}
                  onChange={(e) => handleChangeNumber(e, field.name)}
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            )}
            {/* Calendar Input */}
            {field.type === "calendar" && (
              <div className="">
                <label htmlFor="dateInput" className="form-label fs-10">
                  {field?.label || "Select Date"}
                </label>
                <input
                  type="date"
                  id="dateInput fs-10"
                  className="form-control fs-10"
                  placeholder="Choose a date"
                  value={
                    orderMaster[field.name]
                      ? formatToYYYYMMDD(orderMaster[field.name] as string)
                      : 0
                  }
                  onChange={(e) => handleCalendarChange(e, field.name)}
                />
              </div>
            )}

            {/* Autocomplete Input */}
            {field.type === "autoComplete" && (
              <div className="">
                <label htmlFor={field?.name} className="form-label fs-10">
                  {field?.label}
                </label>
                <AutoCompleteDropDown
                  field={field}
                  formValues={orderMaster}
                  defaultValue={formMainObj[field.name]}
                  fieldName={formMainObj.fieldName}
                  updateStateFunction={updateStateFunction}
                  size={"small"}
                  handleOnSelect={handleOnSelect}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default CommonFormComponent;
