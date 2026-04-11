import { db } from "../db/connection";
import { Equipments } from "../db/schema";
import type { CreateEquipmentInput, EquipmentModel } from "../type";

export async function createEquipment(
  input: CreateEquipmentInput & {
    equipmentName: string;
    category: string;
    registrationOrChassisNo: string;
    operationalAssignment?: string;
    primaryOperator: string;
    initialStatus: string;
  },
  createdBy: number,
): Promise<EquipmentModel> {
  const payload: typeof Equipments.$inferInsert = {
    equipmentName: input.equipmentName,
    category: input.category,
    registrationOrChassisNo: input.registrationOrChassisNo,
    operationalAssignment: input.operationalAssignment,
    primaryOperator: input.primaryOperator,
    initialStatus: input.initialStatus,
    createdBy,
  };

  const rows = await db.insert(Equipments).values(payload).returning();
  return rows[0] as EquipmentModel;
}

export async function getEquipments(): Promise<EquipmentModel[]> {
  return db.select().from(Equipments);
}
