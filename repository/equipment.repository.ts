import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Equipments } from "../db/schema";
import type {
  CreateEquipmentInput,
  EquipmentModel,
  UpdateEquipmentInput,
} from "../type";

export async function getEquipmentById(
  id: number,
): Promise<EquipmentModel | null> {
  const rows = await db
    .select()
    .from(Equipments)
    .where(eq(Equipments.id, id))
    .limit(1);

  return (rows[0] as EquipmentModel | undefined) ?? null;
}

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

export async function updateEquipment(
  id: number,
  input: UpdateEquipmentInput,
): Promise<EquipmentModel | null> {
  const rows = await db
    .update(Equipments)
    .set({
      ...(input.equipmentName && { equipmentName: input.equipmentName }),
      ...(input.category && { category: input.category }),
      ...(input.registrationOrChassisNo && {
        registrationOrChassisNo: input.registrationOrChassisNo,
      }),
      ...(input.operationalAssignment !== undefined && {
        operationalAssignment: input.operationalAssignment,
      }),
      ...(input.primaryOperator && { primaryOperator: input.primaryOperator }),
      ...(input.initialStatus && { initialStatus: input.initialStatus }),
    })
    .where(eq(Equipments.id, id))
    .returning();

  return (rows[0] as EquipmentModel | undefined) ?? null;
}

export async function deleteEquipment(id: number): Promise<boolean> {
  const rows = await db
    .delete(Equipments)
    .where(eq(Equipments.id, id))
    .returning();
  return rows.length > 0;
}
