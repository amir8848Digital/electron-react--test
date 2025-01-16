export async function fetchFullForm(client: any, kwargs: any) {
  const query = `
        SELECT 
            om.*,
            'orderMaster' AS "formName",
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'order_design_id', od.order_design_id,
                        'parent_id', od.parent_id,
                        'design_code', od.design_code,
                        'calc_price', od.calc_price,
                        'suffix', od.suffix,
                        'formName', 'orderDesign',
                        'rate_chart', COALESCE(
                            (
                                SELECT JSON_AGG(
                                    to_jsonb(orc) || JSONB_BUILD_OBJECT('formName', 'OrderRateChart')
                                )
                                FROM order_rate_chart orc
                                WHERE orc.parent_id = CAST(od.order_design_id AS VARCHAR)
                            ),
                            '[]'::JSON
                        ),
                        'labour_chart', COALESCE(
                            (
                                SELECT JSON_AGG(
                                    to_jsonb(olc) || JSONB_BUILD_OBJECT('formName', 'OrderLabourChart')
                                )
                                FROM order_labour_chart olc
                                WHERE olc.parent_id = CAST(od.order_design_id AS VARCHAR)
                            ),
                            '[]'::JSON
                        )
                    )
                ),
                '[]'::JSON
            ) AS order_design
        FROM 
            order_master om
        LEFT JOIN 
            order_design od ON CAST(od.parent_id AS INTEGER) = om.order_id
        WHERE 
            om.order_id = $1
        GROUP BY 
            om.order_id;
    `;

  try {
    const r = await client.query(query, [kwargs.value[0].order_id]);
    return r.rows[0];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
