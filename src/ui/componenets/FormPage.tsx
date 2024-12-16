import React, { useEffect, useState } from 'react'
import SearchableDropdown, { tableData } from './SearchableDropDown';

type Props = {}

const FormPage = (props: Props) => {
   const [selectedOption, setSelectedOption] = useState(null);

   const handleSelectOption = (option:any) => {
     setSelectedOption(option);
   };
  
   useEffect(() => {
     const res =  window.electron.getStaticData()
     console.log({res})
   },[])
   const filteredTableData = selectedOption
   // @ts-ignore
     ? tableData.filter((row:any) => row.country === selectedOption.country)
     : tableData;


  return (
    <div>
        <div className="">
      <h2>Searchable Dropdown and Table</h2>
      <div>
        <div>
          <h3>Select Country</h3>
          <SearchableDropdown
            options={[
              { id: 1, name: "USA", country: "USA" },
              { id: 2, name: "Canada", country: "Canada" },
              { id: 3, name: "UK", country: "UK" },
              { id: 4, name: "Australia", country: "Australia" },
            ]}
            onSelect={handleSelectOption}
          />
        </div>

        <div>
          <h3>Table of People</h3>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.age}</td>
                  <td>{row.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  )
}

export default FormPage