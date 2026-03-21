import { db } from "../db/connection";
import { Users } from "../db/schema";
import { CreateEmployeeInput, UserModel } from "../type";

export async function createEmployeeByAdmin(
  input: CreateEmployeeInput,
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
      isAdmin: false,
      adminId,
      createdBy: adminId,
      uanNumber: input.uanNumber,
      age: input.age,
    })
    .returning();

  return rows[0] as UserModel;
}
