
// import { client } from './main.js';

// export async function insertData(formData: any) {
//     console.log(formData)
//     try {
//             const result = await client.query(    
//             'INSERT INTO OrderMaster (voucher_part1, voucher_part2, voucher_part3, voucher_part4, order_date, currency, multi_div, customer_id, customer_name, conv_fact, conv_d, lmg_sales, lmp_sales, lms_sales, lml_sales, chi_x_kt, po_no, po_date, priority, exp_del_date, prod_del_date, ord_lock, pwd, lk_sales_price, refresh_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24 , $25)',
//             [
//                 formData.voucher_part1, formData.voucher_part2, formData.voucher_part3, formData.voucher_part4,
//                 formData.date, formData.currency, formData.multi_div, formData.customer_id, formData.customer_name,
//                 formData.conv_fact, formData.conv_d, formData.lmg_sales, formData.lmp_sales, formData.lms_sales,
//                 formData.lml_sales, formData.chi_x_kt, formData.po_no, formData.po_date, formData.priority,
//                 formData.exp_del_date, formData.prod_del_date, formData.ord_lock, formData.pwd, formData.lk_sales_price,
//                 formData.refresh_date
//             ]
//         );
//         return { success: true, message: 'Record inserted successfully' };
//     } catch (error) {
//         console.log('Error inserting record:', error);
//         return { success: false, message: 'Failed to insert record' };
//     }
// }

// export async function getSalesOrderData() {
//   const sqlQuery = `
//         SELECT order_id, TO_CHAR(order_date, 'YYYY-MM-DD') AS order_date,customer_id,customer_name, currency, 
//         TO_CHAR(po_date, 'YYYY-MM-DD') AS po_date,po_no,priority
//         FROM OrderMaster        
//         LIMIT 20;
//     `;
   

//     const result = await client.query(sqlQuery);
//     return result.rows; 
// }

