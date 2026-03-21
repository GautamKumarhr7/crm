import { db, pool } from "./connection";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
async function migrations() {
  console.log("Running the migrations");

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Done with migrations...");
}

migrations()
  .catch((err) => {
    console.log(err);
  })
  .finally(() => pool.end());
