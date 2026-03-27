import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Tenders } from "../db/schema";
import type { CreateTenderInput, TenderModel } from "../type";

export async function findTenderByContractNo(
  contractNo: string,
): Promise<TenderModel | null> {
  const rows = await db
    .select()
    .from(Tenders)
    .where(eq(Tenders.contractNo, contractNo))
    .limit(1);

  return (rows[0] as TenderModel | undefined) ?? null;
}

export async function createTender(
  input: CreateTenderInput & {
    nameOfWork: string;
    natureOfWorkBriefDescription: string;
    clientNameAddress: string;
    contractNo: string;
    value: number;
    date: string;
  },
  createdBy: number,
): Promise<TenderModel> {
  const payload: typeof Tenders.$inferInsert = {
    nameOfWork: input.nameOfWork,
    natureOfWorkBriefDescription: input.natureOfWorkBriefDescription,
    clientNameAddress: input.clientNameAddress,
    contractNo: input.contractNo,
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
