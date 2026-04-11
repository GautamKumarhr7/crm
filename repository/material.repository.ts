import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Materials } from "../db/schema";
import type {
  CreateMaterialInput,
  MaterialModel,
  UpdateMaterialInput,
} from "../type";

export async function getMaterialById(
  id: number,
): Promise<MaterialModel | null> {
  const rows = await db
    .select()
    .from(Materials)
    .where(eq(Materials.id, id))
    .limit(1);

  return (rows[0] as MaterialModel | undefined) ?? null;
}

export async function createMaterial(
  input: CreateMaterialInput & {
    materialName: string;
    category: string;
    warehouseLocation: string;
    quantity: number;
    quantityType: string;
    avgPurchaseRate: number;
  },
  createdBy: number,
): Promise<MaterialModel> {
  const payload: typeof Materials.$inferInsert = {
    materialName: input.materialName,
    category: input.category,
    warehouseLocation: input.warehouseLocation,
    quantity: input.quantity,
    quantityType: input.quantityType,
    avgPurchaseRate: input.avgPurchaseRate,
    createdBy,
  };

  const rows = await db.insert(Materials).values(payload).returning();
  return rows[0] as MaterialModel;
}

export async function getMaterials(): Promise<MaterialModel[]> {
  return db.select().from(Materials);
}

export async function updateMaterial(
  id: number,
  input: UpdateMaterialInput,
): Promise<MaterialModel | null> {
  const rows = await db
    .update(Materials)
    .set({
      ...(input.materialName && { materialName: input.materialName }),
      ...(input.category && { category: input.category }),
      ...(input.warehouseLocation && {
        warehouseLocation: input.warehouseLocation,
      }),
      ...(input.quantity !== undefined && { quantity: input.quantity }),
      ...(input.quantityType && { quantityType: input.quantityType }),
      ...(input.avgPurchaseRate !== undefined && {
        avgPurchaseRate: input.avgPurchaseRate,
      }),
    })
    .where(eq(Materials.id, id))
    .returning();

  return (rows[0] as MaterialModel | undefined) ?? null;
}

export async function deleteMaterial(id: number): Promise<boolean> {
  const rows = await db
    .delete(Materials)
    .where(eq(Materials.id, id))
    .returning();
  return rows.length > 0;
}
