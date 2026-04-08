import { and, eq, ne } from "drizzle-orm";

import { ADMIN_ROLE_ID } from "../constant/role.constant";
import { db } from "../db/connection";
import { Users } from "../db/schema";
import { CreateEmployeeInput, UpdateEmployeeInput, UserModel } from "../type";

export async function createEmployeeByAdmin(
  input: CreateEmployeeInput & {
    name: string;
    email: string;
    department: string;
    roleId: number;
  },
  adminId: number,
  hashedPassword: string,
): Promise<UserModel> {
  const rows = await db
    .insert(Users)
    .values({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      department: input.department,
      roleId: input.roleId,
      designation: input.designation,
      dateOfJoining: input.dateOfJoining,
      sallery: input.sallery,
      type: "employee",
      pancardNo: input.pancardNo,
      aadharNo: input.aadharNo,
      pancardUrl: input.pancardUrl,
      aadharUrl: input.aadharUrl,
      pfDeduction: input.pfDeduction,
      esiDeduction: input.esiDeduction,
      adminId,
      createdBy: adminId,
      uanNumber: input.uanNumber,
      age: input.age,
    })
    .returning();

  return rows[0] as UserModel;
}

export async function updateEmployeeByAdmin(
  userId: number,
  input: UpdateEmployeeInput,
  hashedPassword?: string,
): Promise<UserModel | null> {
  const updateData: any = { ...input };

  if (hashedPassword) {
    updateData.password = hashedPassword;
  }

  const rows = await db
    .update(Users)
    .set(updateData)
    .where(eq(Users.id, userId))
    .returning();

  return rows[0] ?? null;
}

export async function deleteEmployeeByAdmin(userId: number): Promise<boolean> {
  const result = await db
    .delete(Users)
    .where(and(eq(Users.id, userId), ne(Users.roleId, ADMIN_ROLE_ID)));

  return (result.rowCount ?? 0) > 0;
}

export async function getEmployeesByAdmin(
  _adminId: number,
): Promise<UserModel[]> {
  return db.select().from(Users).where(ne(Users.roleId, ADMIN_ROLE_ID));
}

export async function getEmployeByuserId(
  _adminId: number,
  userId: number,
): Promise<UserModel | null> {
  const rows = await db
    .select()
    .from(Users)
    .where(and(eq(Users.id, userId), ne(Users.roleId, ADMIN_ROLE_ID)));

  return rows[0] ?? null;
}

export async function getEmployeById(
  userId: number,
): Promise<UserModel | null> {
  const rows = await db.select().from(Users).where(eq(Users.id, userId));

  return rows[0] ?? null;
}
