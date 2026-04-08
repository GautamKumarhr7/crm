import { db } from "../db/connection";
import { LeaveAllocations, Leaves } from "../db/schema";
import { eq, and, sum } from "drizzle-orm";
import type { CreateLeaveAllocationInput, LeaveAllocationModel } from "../type";

export async function createLeaveAllocation(
  input: CreateLeaveAllocationInput & { userId: number; createdBy: number },
): Promise<LeaveAllocationModel> {
  const rows = await db
    .insert(LeaveAllocations)
    .values({
      userId: input.userId,
      sick: input.sick ?? 0,
      casual: input.casual ?? 0,
      annual: input.annual ?? 0,
      company: input.company ?? 0,
      other: input.other ?? 0,
      createdBy: input.createdBy,
    })
    .returning();

  return rows[0] as LeaveAllocationModel;
}

export async function getLeaveAllocations(): Promise<LeaveAllocationModel[]> {
  return db.select().from(LeaveAllocations);
}

export async function getLeaveAllocationByUserId(
  userId: number,
): Promise<LeaveAllocationModel | null> {
  const rows = await db
    .select()
    .from(LeaveAllocations)
    .where(eq(LeaveAllocations.userId, userId));
  return rows[0] || null;
}

export async function updateLeaveAllocation(
  userId: number,
  input: CreateLeaveAllocationInput,
): Promise<LeaveAllocationModel> {
  const rows = await db
    .update(LeaveAllocations)
    .set({
      sick: input.sick,
      casual: input.casual,
      annual: input.annual,
      company: input.company,
      other: input.other,
    })
    .where(eq(LeaveAllocations.userId, userId))
    .returning();

  return rows[0] as LeaveAllocationModel;
}

export async function getUsedLeaves(
  userId: number,
  leaveType: string,
): Promise<number> {
  const rows = await db
    .select({ total: sum(Leaves.days).mapWith(Number) })
    .from(Leaves)
    .where(
      and(
        eq(Leaves.userId, userId),
        eq(Leaves.type, leaveType),
        eq(Leaves.status, "approved"),
      ),
    );

  return rows[0]?.total ?? 0;
}
