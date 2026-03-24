import { db } from "../db/connection";
import { Works } from "../db/schema";
import type { CreateWorkInput, WorkModel } from "../type";

export async function createWork(
  input: CreateWorkInput,
  createdBy: number,
): Promise<WorkModel> {
  const rows = await db
    .insert(Works)
    .values({
      projectId: input.projectId,
      contractor: input.contractor,
      description: input.description,
      value: input.value,
      retention: input.retention,
      startDate: input.startDate,
      target: input.target,
      type: input.type,
      status: input.status,
      createdBy,
    })
    .returning();

  return rows[0] as WorkModel;
}

export async function getWorks(): Promise<WorkModel[]> {
  return db.select().from(Works);
}
