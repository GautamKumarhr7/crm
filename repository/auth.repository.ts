import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Users } from "../db/schema";

export async function findUserByEmail(email: string) {
  const rows = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
  return rows[0] ?? null;
}
