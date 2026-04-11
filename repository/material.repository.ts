import { db } from "../db/connection";
import { Materials } from "../db/schema";
import type { CreateMaterialInput, MaterialModel } from "../type";

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
