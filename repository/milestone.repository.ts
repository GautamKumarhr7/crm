import { db } from "../db/connection";
import { Milestones } from "../db/schema";
import type { CreateMilestoneInput, MilestoneModel } from "../type";

export async function createMilestone(
  input: CreateMilestoneInput,
): Promise<MilestoneModel> {
  const rows = await db
    .insert(Milestones)
    .values({
      siteId: input.siteId,
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      priority: input.priority,
      status: input.status,
      completion: input.completion,
    })
    .returning();

  return rows[0] as MilestoneModel;
}

export async function getMilestones(): Promise<MilestoneModel[]> {
  return db.select().from(Milestones);
}
