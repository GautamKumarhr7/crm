import { db } from "../db/connection";
import { Leaves } from "../db/schema";
import type { CreateLeaveInput, LeaveModel } from "../type";
import { eq } from "drizzle-orm";

export async function createLeave(
  input: Omit<CreateLeaveInput, "userId" | "type" | "title" | "reason"> & {
    userId: number;
    type: string;
    title: string;
    reason: string;
    createdBy: number;
  },
): Promise<LeaveModel> {
  const payload: typeof Leaves.$inferInsert = {
    userId: input.userId,
    type: input.type,
    title: input.title,
    reason: input.reason,
    days: input.days || undefined,
    from: input.from || undefined,
    to: input.to || undefined,
    createdBy: input.createdBy,
  };

  const rows = await db.insert(Leaves).values(payload).returning();

  return rows[0] as LeaveModel;
}

export async function getLeaves(): Promise<LeaveModel[]> {
  return db.select().from(Leaves);
}

export async function getLeavesByUserId(userId: number): Promise<LeaveModel[]> {
  return db.select().from(Leaves).where(eq(Leaves.userId, userId));
}

export async function getLeaveById(id: number): Promise<LeaveModel | null> {
  const rows = await db.select().from(Leaves).where(eq(Leaves.id, id));
  return rows[0] || null;
}

export async function approveLeave(
  id: number,
  approvedBy: number,
): Promise<LeaveModel> {
  const rows = await db
    .update(Leaves)
    .set({
      status: "approved",
      approvedBy,
    })
    .where(eq(Leaves.id, id))
    .returning();

  return rows[0] as LeaveModel;
}

export async function rejectLeave(
  id: number,
  approvedBy: number,
  rejectionReason: string,
): Promise<LeaveModel> {
  const rows = await db
    .update(Leaves)
    .set({
      status: "rejected",
      approvedBy,
      rejectionReason,
    })
    .where(eq(Leaves.id, id))
    .returning();

  return rows[0] as LeaveModel;
}
