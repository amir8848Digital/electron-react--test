import React, { useEffect, useState } from "react";

type Props = {};

const FormPage = (props: Props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectOption = (option: any) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const res = window.electron.getStaticData();
    console.log({ res });
  }, []);
  const filteredTableData = selectedOption
    ? // @ts-ignore
      tableData.filter((row: any) => row.country === selectedOption.country)
    : tableData;

  return (
    <div>
      <h2></h2>

      {/* Input field for searching */}
      <div>
        <h3>Search Customer</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange} // Handle typing
          onFocus={handleFocus} // Show table on focus
          onBlur={handleBlur} // Hide table on blur
          placeholder="Search by Customer Name..."
          onKeyDown={handleKeyDown} // Handle keyboard events (up, down, enter)
        />
      </div>

      {/* Show customer table only when input is focused */}
      {isFocused && (
        <div>
          <h3>Customer Table</h3>
          <table style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableData.map((item: any, index: number) => (
                <tr
                  key={item.customer_id}
                  onClick={() => handleRowClick(item)} // Allow row click selection
                  style={{
                    backgroundColor:
                      highlightedIndex === index ? "lightgray" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <td>{item.customer_id}</td>
                  <td>{item.customer_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display selected customer details */}
      {selectedCustomer && (
        <div>
          <h3>Selected Customer</h3>
          <p>Customer ID: {selectedCustomer.customer_id}</p>
          <p>Customer Name: {selectedCustomer.customer_name}</p>
        </div>
      )}
    </div>
  );
};

export default FormPage;
