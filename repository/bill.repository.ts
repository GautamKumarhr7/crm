import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Bills } from "../db/schema";
import type { BillModel, CreateBillInput } from "../type";

export async function findBillByCode(code: string): Promise<BillModel | null> {
  const rows = await db
    .select()
    .from(Bills)
    .where(eq(Bills.code, code))
    .limit(1);
  return (rows[0] as BillModel | undefined) ?? null;
}

export async function createBill(
  input: CreateBillInput,
  createdBy: number,
): Promise<BillModel> {
  const rows = await db
    .insert(Bills)
    .values({
      code: input.code,
      description: input.description,
      unit: input.unit,
      contractAmount: input.contractAmount,
      subrate: input.subrate,
      poQuantity: input.poQuantity,
      billedQuantity: input.billedQuantity,
      noOfContract: input.noOfContract,
      diffValue: input.diffValue,
      status: input.status,
      isDeleted: input.isDeleted ?? false,
      createdBy,
    })
    .returning();

  return rows[0] as BillModel;
}

export async function getBills(): Promise<BillModel[]> {
  return db.select().from(Bills);
}
