import { db } from './db/connection';
import { Materials } from './db/schema';
async function test() {
  try {
    const res = await db.select().from(Materials).limit(1);
    console.log("Materials table exists, rows:", res.length);
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
test();
