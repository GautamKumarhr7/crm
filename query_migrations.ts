import { db, pool } from "./db/connection";
import { sql } from "drizzle-orm";

async function run() {
  const res = await db.execute(sql`SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at DESC`);
  console.log(res.rows);
  pool.end();
}
run();
