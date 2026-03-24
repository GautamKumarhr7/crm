import { db } from "../db/connection";
import { LeaveAllocations } from "../db/schema";
import type { CreateLeaveAllocationInput, LeaveAllocationModel } from "../type";

export async function createLeaveAllocation(
  input: CreateLeaveAllocationInput,
): Promise<LeaveAllocationModel> {
  const rows = await db
    .insert(LeaveAllocations)
    .values({
      userId: input.userId,
      leaveId: input.leaveId,
      status: input.status,
      taken: input.taken,
      reason: input.reason,
    })
    .returning();

  return rows[0] as LeaveAllocationModel;
}

export async function getLeaveAllocations(): Promise<LeaveAllocationModel[]> {
  return db.select().from(LeaveAllocations);
}
