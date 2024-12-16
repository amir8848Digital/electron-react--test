import React, { useState } from "react";

// Searchable Dropdown Component
const SearchableDropdown = ({ options, onSelect }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (event: any) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredOptions(
      options.filter((option: any) =>
        option.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search..."
      />
      {isFocused && (
        <ul>
          {filteredOptions.map((option: any) => (
            <li
              key={option.id}
              onClick={() => onSelect(option)}
              style={{ cursor: "pointer", padding: "5px" }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
