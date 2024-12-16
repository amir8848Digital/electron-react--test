import React, { useEffect, useState } from 'react'
import SearchableDropdown, { tableData } from './SearchableDropDown';

type Props = {}

const FormPage = (props: Props) => {
   const [selectedOption, setSelectedOption] = useState(null);

   const handleSelectOption = (option:any) => {
     setSelectedOption(option);
   };
  
   useEffect(() => {
  //   const formData = {
  //     voucher_part1: 'A123',
  //     voucher_part2: 'B456',
  //     voucher_part3: 'C789',
  //     voucher_part4: 'D013',
  //     date: '2024-12-01',
  //     currency: 'QTR',
  //     multi_div: 'None',
  //     customer_id: 1,
  //     customer_name: '',
  //     conv_fact: 1.2,
  //     conv_d: 1.3,
  //     lmg_sales: 100.00,
  //     lmp_sales: 200.00,
  //     lms_sales: 300.00,
  //     lml_sales: 400.00,
  //     chi_x_kt: 1,
  //     po_no: 'PO001',
  //     po_date: '2024-11-15',
  //     priority: 'High',
  //     exp_del_date: '2024-12-20',
  //     prod_del_date: '2024-12-25',
  //     ord_lock: false,
  //     pwd: 'password123',
  //     lk_sales_price: 500.00,
  //     refresh_date: '2024-12-01'
  // };
    //console.log(formData,"FFF")
     const res =  window.electron.getStaticData()
     const res1 =  window.electron.getSalesOrderData()
   //  const res3  =window.electron.insertData(formData)
     console.log({res})
     console.log({res1})
   
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