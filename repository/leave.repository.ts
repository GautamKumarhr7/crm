import { db } from "../db/connection";
import { Leaves } from "../db/schema";
import type { CreateLeaveInput, LeaveModel } from "../type";

export async function createLeave(
  input: CreateLeaveInput,
): Promise<LeaveModel> {
  const rows = await db
    .insert(Leaves)
    .values({
      type: input.type,
      total: input.total,
    })
    .returning();

  return rows[0] as LeaveModel;
}

export async function getLeaves(): Promise<LeaveModel[]> {
  return db.select().from(Leaves);
}
