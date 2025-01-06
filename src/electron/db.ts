import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "chintan",
  host: "3.20.115.50",
  database: "mydb",
  password: "Chintan@8848",
  connectionTimeoutMillis: 150000,
  // port: 10071,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

pool.on("connect", () => {
  console.log("Database connection established.");
});

pool.on("error", (err) => {
  console.error("Unexpected error on database connection:", err.message);
});

export async function performTransaction(
  type: "readOnly" | "write",
  actions: (client: any) => Promise<any>
) {
  const client = await pool.connect();
  try {
    if (type === "write") {
      await client.query("BEGIN");
    }

    const result = await actions(client);

    if (type === "write") {
      await client.query("COMMIT");
      console.log("Write transaction committed successfully.");
    }

    return result;
  } catch (error: any) {
    if (type === "write") {
      await client.query("ROLLBACK");
      console.error("Transaction rolled back due to an error:", error);
      return error;
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function query(sql: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}
