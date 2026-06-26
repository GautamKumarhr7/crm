import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Vouchers } from "../db/schema";
import type {
  CreateVoucherInput,
  UpdateVoucherInput,
  VoucherModel,
} from "../type";

export async function getVoucherById(id: number): Promise<VoucherModel | null> {
  const rows = await db
    .select()
    .from(Vouchers)
    .where(eq(Vouchers.id, id))
    .limit(1);

  return (rows[0] as VoucherModel | undefined) ?? null;
}

export async function createVoucher(
  input: CreateVoucherInput & {
    type: string;
    date: string;
  },
  createdBy: number,
): Promise<VoucherModel> {
  const payload: typeof Vouchers.$inferInsert = {
    type: input.type,
    date: input.date,
    ...(input.partyId !== undefined && { partyId: input.partyId }),
    ...(input.materialId !== undefined && { materialId: input.materialId }),
    ...(input.quantity !== undefined && { quantity: input.quantity }),
    ...(input.amount !== undefined && { amount: input.amount }),
    ...(input.sgst !== undefined && { sgst: input.sgst }),
    ...(input.cgst !== undefined && { cgst: input.cgst }),
    ...(input.invoiceNo !== undefined && { invoiceNo: input.invoiceNo }),
    createdBy,
  };

  const rows = await db.insert(Vouchers).values(payload).returning();
  return rows[0] as VoucherModel;
}

export async function getVouchers(): Promise<VoucherModel[]> {
  return db.select().from(Vouchers);
}

export async function updateVoucher(
  id: number,
  input: UpdateVoucherInput,
): Promise<VoucherModel | null> {
  const rows = await db
    .update(Vouchers)
    .set({
      ...(input.type && { type: input.type }),
      ...(input.date && { date: input.date }),
      ...(input.partyId !== undefined && { partyId: input.partyId }),
      ...(input.materialId !== undefined && { materialId: input.materialId }),
      ...(input.quantity !== undefined && { quantity: input.quantity }),
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.sgst !== undefined && { sgst: input.sgst }),
      ...(input.cgst !== undefined && { cgst: input.cgst }),
      ...(input.invoiceNo !== undefined && { invoiceNo: input.invoiceNo }),
    })
    .where(eq(Vouchers.id, id))
    .returning();

  return (rows[0] as VoucherModel | undefined) ?? null;
}

export async function deleteVoucher(id: number): Promise<boolean> {
  const rows = await db.delete(Vouchers).where(eq(Vouchers.id, id)).returning();
  return rows.length > 0;
}
