import { db, pool } from "./connection";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
async function migrations() {
  console.log("Running the migrations");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Done with migrations...");
  } catch (err) {
    console.error("Migration error:", err);
    const cause = (err as any)?.cause;
    // Postgres error code 42710 = duplicate_object (e.g., type already exists)
    if (cause && cause.code === "42710") {
      console.warn("Migration warning: object already exists — continuing.");
    } else {
      throw err;
    }
  }
}

migrations()
  .catch((err) => {
    console.log(err);
  })
  .finally(() => pool.end());
