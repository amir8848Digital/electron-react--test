//import { client } from "../../main.js";
export async function fetchFullForm(client: any, kwargs: any) {
  return [
    {
      voucher_part1: "voucher1",
      order_id: "100",
      formName: "orderMaster",
      order_design: [
        {
          design_code: "D001",
          formName: "orderDesign",
          rate_chart: [
            {
              category: "DDDDDDD",
              formName: "orderRateChart",
            },
          ],
          labour_chart: [
            {
              main_cd: "DDDDDDD",
              sub_cd: "DDDDDDDF",
              formName: "orderLabourChart",
            },
          ],
        },
      ],
    },
  ];
  const query = `
      SELECT
          om.*,
          oe.*
      FROM
          "public"."ordermaster" om
      JOIN
          "public"."orderdesign" oe
      ON
          om.order_id = oe.order_design_id
  `;
  try {
    const r = await client.query(query);
    console.log("############################", r);
    if (r.rows.length === 0) {
      return { orderMaster: null, orderDesign: [] };
    }
    const firstRow = r.rows[0];
    const orderMasterFields = Object.keys(firstRow).filter((field) => {
      return [
        "order_id",
        "customer_id",
        "voucher_part1",
        "voucher_part2",
        "voucher_part3",
        "voucher_part4",
        "order_date",
        "currency",
        "customer_name",
        "lmg_sales",
        "priority",
      ].includes(field);
    });
    const orderDesignFields = Object.keys(firstRow).filter((field) =>
      [
        "order_design_id",
        "order_id",
        "design_code",
        "suffix",
        "size",
        "qty",
        "calc_price",
        "sales_price",
        "prod_dely_date",
        "exp_dely_date",
        "prod_setting",
        "fixed_price",
        "sr_no",
      ].includes(field)
    );
    // Map fields to the appropriate structure
    const orderMaster = orderMasterFields.reduce((obj: any, field: any) => {
      obj[field] = firstRow[field];
      return obj;
    }, {});
    const orderDesign = r.rows.map((row: any) => {
      return orderDesignFields.reduce((obj: any, field) => {
        obj[field] = row[field];
        return obj;
      }, {});
    });
    let x = {
      orderMaster,
      orderDesign,
    };

    return x;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
