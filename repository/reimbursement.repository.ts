import { eq, desc } from "drizzle-orm";
import { db } from "../db/connection";
import { Reimbursements, Users } from "../db/schema";
import type { ReimbursementModel } from "../type";

export async function createReimbursement(payload: typeof Reimbursements.$inferInsert): Promise<ReimbursementModel> {
  const rows = await db.insert(Reimbursements).values(payload).returning();
  return rows[0] as ReimbursementModel;
}

export async function getReimbursements(): Promise<ReimbursementModel[]> {
  return db.select().from(Reimbursements).orderBy(desc(Reimbursements.createdAt));
}

export async function getReimbursementsByUserId(userId: number): Promise<ReimbursementModel[]> {
  return db.select().from(Reimbursements).where(eq(Reimbursements.userId, userId)).orderBy(desc(Reimbursements.createdAt));
}

export async function getReimbursementById(id: number): Promise<ReimbursementModel | null> {
  const rows = await db.select().from(Reimbursements).where(eq(Reimbursements.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function updateReimbursement(id: number, payload: Partial<typeof Reimbursements.$inferInsert>): Promise<ReimbursementModel | null> {
  const rows = await db.update(Reimbursements).set(payload).where(eq(Reimbursements.id, id)).returning();
  return rows[0] ?? null;
}

export async function deleteReimbursement(id: number): Promise<boolean> {
  const result = await db.delete(Reimbursements).where(eq(Reimbursements.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function approveReimbursement(id: number, approvedBy: number): Promise<ReimbursementModel> {
  const rows = await db.update(Reimbursements).set({ status: "approved", approvedBy }).where(eq(Reimbursements.id, id)).returning();
  return rows[0] as ReimbursementModel;
}

export async function rejectReimbursement(id: number, approvedBy: number, rejectionReason: string): Promise<ReimbursementModel> {
  const rows = await db.update(Reimbursements).set({ status: "rejected", approvedBy, rejectionReason }).where(eq(Reimbursements.id, id)).returning();
  return rows[0] as ReimbursementModel;
}
