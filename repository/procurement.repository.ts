import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Procurements } from "../db/schema";
import type { CreateProcurementInput, ProcurementModel } from "../type";

export async function findProcurementByPoNumber(
  poNumber: string,
): Promise<ProcurementModel | null> {
  const rows = await db
    .select()
    .from(Procurements)
    .where(eq(Procurements.poNumber, poNumber))
    .limit(1);

  return (rows[0] as ProcurementModel | undefined) ?? null;
}

export async function createProcurement(
  input: CreateProcurementInput & {
    poNumber: string;
    vendor: string;
    items: string;
    amount: number;
    raised: string;
    expectedDelivery: string;
    progress: string;
    status: string;
  },
  createdBy: number,
): Promise<ProcurementModel> {
  const payload: typeof Procurements.$inferInsert = {
    poNumber: input.poNumber,
    vendor: input.vendor,
    items: input.items,
    amount: input.amount,
    raised: input.raised,
    expectedDelivery: input.expectedDelivery,
    progress: input.progress,
    status: input.status,
    createdBy,
  };

  const rows = await db.insert(Procurements).values(payload).returning();
  return rows[0] as ProcurementModel;
}

export async function getProcurements(): Promise<ProcurementModel[]> {
  return db.select().from(Procurements);
}
