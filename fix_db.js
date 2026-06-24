const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`ALTER TABLE materials ALTER COLUMN warehouse_location DROP NOT NULL;`);
    console.log("Successfully dropped NOT NULL constraint on warehouse_location");
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
