import { db } from "../db/connection";
import { Projects } from "../db/schema";
import type { CreateProjectInput, ProjectModel } from "../type";

export async function createProject(
  input: CreateProjectInput,
  createdBy: number,
): Promise<ProjectModel> {
  const rows = await db
    .insert(Projects)
    .values({
      code: input.code,
      name: input.name,
      client: input.client,
      category: input.category,
      value: input.value,
      process: input.process,
      status: input.status,
      location: input.location,
      advancement: input.advancement,
      startDate: input.startDate,
      endDate: input.endDate,
      employeeId: input.employeeId,
      createdBy,
    })
    .returning();

  return rows[0] as ProjectModel;
}

export async function getProjects(): Promise<ProjectModel[]> {
  return db.select().from(Projects);
}
