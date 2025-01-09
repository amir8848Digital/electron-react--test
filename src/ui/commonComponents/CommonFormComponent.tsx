import React, { useState } from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";

type Props = {};

const CommonFormComponent = ({
  formMainObj,
  orderMaster,
  setOrderMaster,
  setRowDataForTable1,
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
    if (field.type === "autoComplete") {
      values = { ...values, ...value[0] };
    } else {
      values = { ...values, [field.name]: value };
    }
    setOrderMaster((prev: any) => ({
      ...prev,
      ...values,
    }));
  };

  const handleOnSelect = async (data: any, value: any) => {
    console.log(data, value, "handleOnSelect");
    if (data?.onSelect?.fetchFullForm) {
      const res = await window.electron.triggerFunction({
        path: data.onSelect.fetchFullForm,
        inputs: {},
      });
      console.log(res?.data?.orderDesign, "handleOnSelect new");
      let orderDesignData = res?.data?.orderDesign || [];
      orderDesignData =
        orderDesignData?.length > 0
          ? orderDesignData.filter(
              (item: any) => item.order_id === value[0]?.order_id
            )
          : [];
      console.log(orderDesignData, "orderDesignData handleOnSelect");
      setRowDataForTable1(orderDesignData);
    }
  };

  const handdleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await window.electron.insertFormData([
      {
        formData: orderMaster.formValues,
        formName: formMainObj.fieldName,
      },
    ]);
    console.log(res, orderMaster, "handdleSubmit");
  };

  return (
    <form onSubmit={handdleSubmit}>
      <div className="row p-4 g-2">
        {formMainObj?.fields?.map((field: any, index: number) => (
          <div className="col-md-2" key={index}>
            {field.type === "text" && (
              <div className="">
                <label id={field.name} className="form-label fs-10">
                  {field.label}
                </label>
                <input
                  type="text"
                  className="form-control  fs-10"
                  value={orderMaster[field.name] as string}
                  onChange={(e) => handleChange(e, field.name)}
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            )}
            {field.type === "number" && (
              <div className="">
                <label htmlFor={field.name} className="form-label fs-10">
                  {field.label}
                </label>
                <input
                  type="number"
                  id={field.name}
                  className="form-control fs-10"
                  value={orderMaster[field.name] as number}
                  onChange={(e) => handleChangeNumber(e, field.name)}
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            )}
            {/* Calendar Input */}
            {field.type === "calendar" && (
              <div className="">
                <label htmlFor="dateInput" className="form-label fs-10">
                  {field.label || "Select Date"}
                </label>
                <input
                  type="date"
                  id="dateInput fs-10"
                  className="form-control fs-10"
                  placeholder="Choose a date"
                  value={orderMaster[field.name] as string}
                  onChange={(e) => handleCalendarChange(e, field.name)}
                />
              </div>
            )}

            {/* Autocomplete Input */}
            {field.type === "autoComplete" && (
              <div className="">
                <label htmlFor={field.name} className="form-label fs-10">
                  {field.label}
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
        <div className="">
          <button type="submit" className="btn btn-primary fs-12">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommonFormComponent;