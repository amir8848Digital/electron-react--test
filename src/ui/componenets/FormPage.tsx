import React, { useEffect, useState } from 'react';


type Props = {};

const FormPage = (props: Props) => {
  const [customerDetails, setCustomerDetails] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // This will be used for filtering the table
  const [isFocused, setIsFocused] = useState(false); // To track input field focus state
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null); // To track the highlighted row
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null); // To track selected customer

  // Fetch customer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await window.electron.getStaticData(); // Fetch customer data
        console.log({ res });
        setCustomerDetails(res); // Set the fetched data
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };
    fetchData(); // Fetch the customer data on component mount
  }, []);

  // Filter data based on the search term (input field value)
  const filteredTableData = customerDetails.filter((row: any) => {
    const nameMatch = row.customer_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());  // Case insensitive filtering
    return nameMatch;
  });

  // Handle input field focus
  const handleFocus = () => {
    setIsFocused(true); // Show table when focused
  };

  // Handle input field blur
  const handleBlur = () => {
    setIsFocused(false); // Hide table when not focused
  };

  // Handle the change in input field (for filtering)
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value); // Update search term
  };

  // Handle keyboard navigation (up, down, and enter keys)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      // Move highlight to the next row
      setHighlightedIndex((prevIndex) => 
        prevIndex === null 
          ? 0 
          : Math.min(filteredTableData.length - 1, prevIndex + 1)
      );
    } else if (event.key === 'ArrowUp') {
      // Move highlight to the previous row
      setHighlightedIndex((prevIndex) => 
        prevIndex === null 
          ? 0 
          : Math.max(0, prevIndex - 1)
      );
    } else if (event.key === 'Enter') {
      // Select the currently highlighted row
      if (highlightedIndex !== null) {
        setSelectedCustomer(filteredTableData[highlightedIndex]);
      }
    }
  };

  // Handle table row click (as an alternative to keyboard navigation)
  const handleRowClick = (customer: any) => {
    setSelectedCustomer(customer);
  };

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
          onFocus={handleFocus}         // Show table on focus
          onBlur={handleBlur}           // Hide table on blur
          placeholder="Search by Customer Name..."
          onKeyDown={handleKeyDown}     // Handle keyboard events (up, down, enter)
        />
      </div>

      {/* Show customer table only when input is focused */}
      {isFocused && (
        <div>
          <h3>Customer Table</h3>
          <table  style={{ width: "100%", marginTop: "10px" }}>
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
                    backgroundColor: highlightedIndex === index ? 'lightgray' : 'transparent',
                    cursor: 'pointer',
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
