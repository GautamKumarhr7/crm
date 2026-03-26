import { db } from "../db/connection";
import { MaterialReconciliations } from "../db/schema";
import type {
  CreateMaterialReconciliationInput,
  MaterialReconciliationModel,
} from "../type";

export async function createMaterialReconciliation(
  input: CreateMaterialReconciliationInput & {
    billCode: string;
    description: string;
    unit: string;
    contRate: number;
    subRate: number;
    poQty: number;
    billedQty: number;
    contTotal: number;
    diffQty: number;
    diffValue: number;
    status: string;
  },
  createdBy: number,
): Promise<MaterialReconciliationModel> {
  const payload: typeof MaterialReconciliations.$inferInsert = {
    billCode: input.billCode,
    description: input.description,
    unit: input.unit,
    contRate: input.contRate,
    subRate: input.subRate,
    poQty: input.poQty,
    billedQty: input.billedQty,
    contTotal: input.contTotal,
    diffQty: input.diffQty,
    diffValue: input.diffValue,
    status: input.status,
    createdBy,
  };

  const rows = await db
    .insert(MaterialReconciliations)
    .values(payload)
    .returning();
  return rows[0] as MaterialReconciliationModel;
}

export async function getMaterialReconciliations(): Promise<
  MaterialReconciliationModel[]
> {
  return db.select().from(MaterialReconciliations);
}
