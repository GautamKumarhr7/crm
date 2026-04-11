import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Tds } from "../db/schema";
import type { CreateTdsInput, TdsModel, UpdateTdsInput } from "../type";

export async function getTdsById(id: number): Promise<TdsModel | null> {
  const rows = await db.select().from(Tds).where(eq(Tds.id, id)).limit(1);
  return (rows[0] as TdsModel | undefined) ?? null;
}

export async function findTdsByTdsId(tdsId: string): Promise<TdsModel | null> {
  const rows = await db.select().from(Tds).where(eq(Tds.tdsId, tdsId)).limit(1);
  return (rows[0] as TdsModel | undefined) ?? null;
}

export async function createTds(
  input: CreateTdsInput & {
    tdsId: string;
    vendorId: number;
    section: string;
    date: string;
    period: string;
    reference?: string;
    amount: number;
    status: string;
  },
  createdBy: number,
): Promise<TdsModel> {
  const payload: typeof Tds.$inferInsert = {
    tdsId: input.tdsId,
    vendorId: input.vendorId,
    section: input.section,
    date: input.date,
    period: input.period,
    reference: input.reference,
    amount: input.amount,
    status: input.status,
    createdBy,
  };

  const rows = await db.insert(Tds).values(payload).returning();
  return rows[0] as TdsModel;
}

export async function getTds(): Promise<TdsModel[]> {
  return db.select().from(Tds);
}

export async function updateTds(
  id: number,
  input: UpdateTdsInput,
): Promise<TdsModel | null> {
  const rows = await db
    .update(Tds)
    .set({
      ...(input.tdsId && { tdsId: input.tdsId }),
      ...(input.vendorId !== undefined && { vendorId: input.vendorId }),
      ...(input.section && { section: input.section }),
      ...(input.date && { date: input.date }),
      ...(input.period && { period: input.period }),
      ...(input.reference !== undefined && { reference: input.reference }),
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.status && { status: input.status }),
    })
    .where(eq(Tds.id, id))
    .returning();

  return (rows[0] as TdsModel | undefined) ?? null;
}

export async function deleteTds(id: number): Promise<boolean> {
  const rows = await db.delete(Tds).where(eq(Tds.id, id)).returning();
  return rows.length > 0;
}
