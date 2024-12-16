import React, { useState } from "react";

// Sample data for the table
export const tableData = [
  { id: 1, name: "John Doe", age: 28, country: "USA" },
  { id: 2, name: "Jane Smith", age: 34, country: "Canada" },
  { id: 3, name: "Sam Brown", age: 23, country: "UK" },
  { id: 4, name: "Lucy Green", age: 31, country: "Australia" },
];

// Searchable Dropdown Component
const SearchableDropdown = ({ options, onSelect }:any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleSearchChange = (event:any) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredOptions(
      options.filter((option:any) =>
        option.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <ul>
        {filteredOptions.map((option:any) => (
          <li
            key={option.id}
            onClick={() => onSelect(option)}
            style={{ cursor: "pointer", padding: "5px" }}
          >
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchableDropdown