require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Adding sgst_rate and cgst_rate columns to 'materials' table...");
    
    await pool.query(`
      ALTER TABLE "materials" 
      ADD COLUMN IF NOT EXISTS "sgst_rate" double precision DEFAULT 0 NOT NULL,
      ADD COLUMN IF NOT EXISTS "cgst_rate" double precision DEFAULT 0 NOT NULL
    `);
    
    console.log("Successfully updated 'materials' table.");
  } catch (err) {
    console.error("Error updating table:", err);
  } finally {
    await pool.end();
  }
}

main();
