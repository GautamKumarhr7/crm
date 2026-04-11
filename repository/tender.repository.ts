import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Tenders } from "../db/schema";
import type {
  CreateTenderInput,
  TenderModel,
  UpdateTenderInput,
} from "../type";

export async function getTenderById(id: number): Promise<TenderModel | null> {
  const rows = await db
    .select()
    .from(Tenders)
    .where(eq(Tenders.id, id))
    .limit(1);

  return (rows[0] as TenderModel | undefined) ?? null;
}

export async function findTenderByContractId(
  contractId: string,
): Promise<TenderModel | null> {
  const rows = await db
    .select()
    .from(Tenders)
    .where(eq(Tenders.contractId, contractId))
    .limit(1);

  return (rows[0] as TenderModel | undefined) ?? null;
}

export async function createTender(
  input: CreateTenderInput & {
    name: string;
    description: string;
    nameAddress: Array<Record<string, unknown>>;
    contractId: string;
    value: number;
    date: string;
  },
  createdBy: number,
): Promise<TenderModel> {
  const payload: typeof Tenders.$inferInsert = {
    name: input.name,
    description: input.description,
    nameAddress: input.nameAddress,
    contractId: input.contractId,
    value: input.value,
    date: input.date,
    createdBy,
  };

  const rows = await db.insert(Tenders).values(payload).returning();
  return rows[0] as TenderModel;
}

export async function getTenders(): Promise<TenderModel[]> {
  return db.select().from(Tenders);
}

export async function updateTender(
  id: number,
  input: UpdateTenderInput,
): Promise<TenderModel | null> {
  const rows = await db
    .update(Tenders)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.description && { description: input.description }),
      ...(input.nameAddress && { nameAddress: input.nameAddress }),
      ...(input.contractId && { contractId: input.contractId }),
      ...(input.value !== undefined && { value: input.value }),
      ...(input.date && { date: input.date }),
    })
    .where(eq(Tenders.id, id))
    .returning();

  return (rows[0] as TenderModel | undefined) ?? null;
}

export async function deleteTender(id: number): Promise<boolean> {
  const rows = await db.delete(Tenders).where(eq(Tenders.id, id)).returning();
  return rows.length > 0;
}
