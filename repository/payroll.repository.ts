import { desc, eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Payrolls, Users } from "../db/schema";
import type { PayrollModel, PayrollWithUser, UserModel } from "../type";

export async function createPayroll(input: {
  userId: number;
  basicPay: number;
  hra: number;
  conveyance: number;
  specialBonus: number;
  pfContribution: number;
  esi: number;
  tdsTax: number;
  createdBy: number;
}): Promise<PayrollModel> {
  const rows = await db.insert(Payrolls).values(input).returning();

  return rows[0] as PayrollModel;
}

export async function getPayrolls(): Promise<PayrollWithUser[]> {
  const rows = await db
    .select({
      id: Payrolls.id,
      userId: Payrolls.userId,
      basicPay: Payrolls.basicPay,
      hra: Payrolls.hra,
      conveyance: Payrolls.conveyance,
      specialBonus: Payrolls.specialBonus,
      pfContribution: Payrolls.pfContribution,
      esi: Payrolls.esi,
      tdsTax: Payrolls.tdsTax,
      createdBy: Payrolls.createdBy,
      updatedAt: Payrolls.updatedAt,
      createdAt: Payrolls.createdAt,
      user: {
        id: Users.id,
        name: Users.name,
        email: Users.email,
        department: Users.department,
        designation: Users.designation,
        sallery: Users.sallery,
      },
    })
    .from(Payrolls)
    .leftJoin(Users, eq(Payrolls.userId, Users.id))
    .orderBy(desc(Payrolls.createdAt));

  return rows as PayrollWithUser[];
}

export async function getPayrollsByUserId(
  userId: number,
): Promise<PayrollWithUser[]> {
  const rows = await db
    .select({
      id: Payrolls.id,
      userId: Payrolls.userId,
      basicPay: Payrolls.basicPay,
      hra: Payrolls.hra,
      conveyance: Payrolls.conveyance,
      specialBonus: Payrolls.specialBonus,
      pfContribution: Payrolls.pfContribution,
      esi: Payrolls.esi,
      tdsTax: Payrolls.tdsTax,
      createdBy: Payrolls.createdBy,
      updatedAt: Payrolls.updatedAt,
      createdAt: Payrolls.createdAt,
      user: {
        id: Users.id,
        name: Users.name,
        email: Users.email,
        department: Users.department,
        designation: Users.designation,
        sallery: Users.sallery,
      },
    })
    .from(Payrolls)
    .leftJoin(Users, eq(Payrolls.userId, Users.id))
    .where(eq(Payrolls.userId, userId))
    .orderBy(desc(Payrolls.createdAt));

  return rows as PayrollWithUser[];
}

export async function findPayrollUserById(
  userId: number,
): Promise<UserModel | null> {
  const rows = await db
    .select()
    .from(Users)
    .where(eq(Users.id, userId))
    .limit(1);

  return (rows[0] as UserModel | undefined) ?? null;
}
