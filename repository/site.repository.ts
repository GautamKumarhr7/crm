import { db } from "../db/connection";
import { Sites } from "../db/schema";
import type { CreateSiteInput, SiteModel } from "../type";

export async function createSite(
  input: CreateSiteInput,
  createdBy: number,
): Promise<SiteModel> {
  const rows = await db
    .insert(Sites)
    .values({
      projectId: input.projectId,
      name: input.name,
      location: input.location,
      supervisor: input.supervisor,
      count: input.count,
      budget: input.budget,
      complexity: input.complexity,
      status: input.status,
      rating: input.rating,
      createdBy,
    })
    .returning();

  return rows[0] as SiteModel;
}

export async function getSites(): Promise<SiteModel[]> {
  return db.select().from(Sites);
}
