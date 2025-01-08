import React, { useState } from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";

type Props = {};

const CommonFormComponent = ({
  formMainObj,
  formValues,
  setFormValues,
  setRowDataForTable1,
}: any) => {
  interface FormValues {
    [key: string]: string | Date | null | Date | number;
  }

  //   const initialState: FormValues = formMainObj.fields.reduce(
  //     (acc: any, field: any) => {
  //       acc[field.name] = field.type === "calendar" ? null : "";
  //       return acc;
  //     },
  //     {} as FormValues
  //   );

  //   const [formValues, setFormValues] = useState<FormValues>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormValues({
      ...formValues,
      [name]: e.target.value,
    });
  };

  const handleChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormValues({
      ...formValues,
      [name]: Number(e.target.value),
    });
  };

  const handleCalendarChange = (e: any, name: string) => {
    setFormValues({
      ...formValues,
      [name]: e.target.value,
    });
  };

  const updateStateFunction = (value: any, field: any) => {
    let values = { ...formValues };
    if (field.type === "autoComplete") {
      values = { ...values, ...value[0] };
    } else {
      values = { ...values, [field.name]: value };
    }
    setFormValues({ ...values });
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

  const handdleSubmit = () => {
    const res = window.electron.insertFormData([
      {
        formData: formValues,
        formName: formMainObj.fieldName,
      },
    ]);
    console.log(formValues, "formValues");
  };

  return (
    <form onSubmit={handdleSubmit}>
      <div className="row p-4 g-2">
        {formMainObj?.fields.map((field: any, index: number) => (
          <div className="col-md-2" key={index}>
            {/* Text Input */}
            {field.type === "text" && (
              <div className="">
                <label htmlFor={field.name} className="form-label fs-10">
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.name}
                  className="form-control  fs-10"
                  value={formValues[field.name] as string}
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
                  value={formValues[field.name] as number}
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
                  value={formValues[field.name] as string}
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
                  formValues={formValues}
                  setFormValues={setFormValues}
                  defaultValue={formValues[field.name]}
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
