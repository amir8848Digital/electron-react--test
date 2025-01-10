//import { client } from "../../main.js";
export async function fetchFullForm(client: any, kwargs: any) {
  const query = `
 SELECT
    om.*,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'order_design_id', od.order_design_id,
            'parent_id', od.parent_id,
            'design_code', od.design_code,
            'calc_price', od.calc_price,
            'suffix', od.suffix,
            'rate_chart', (
                SELECT JSON_AGG(
                    to_jsonb(orc)
                )
                FROM order_rate_chart orc
                WHERE orc.parent_id = CAST(od.order_design_id AS VARCHAR)
            ),
            'labour_chart', (
                SELECT JSON_AGG(
                    to_jsonb(olc)
                )
                FROM order_labour_chart olc
                WHERE olc.parent_id = CAST(od.order_design_id AS VARCHAR)
            )
        )
    ) AS order_design
FROM
    orderMaster om
JOIN
    orderDesign od ON CAST(od.parent_id AS INTEGER) = om.order_id
WHERE om.order_id = $1
GROUP BY om.order_id;
  `;
  try {
    const r = await client.query(query, [kwargs.value[0].order_id]);
    return r.rows[0];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
