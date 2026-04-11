import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Vendors } from "../db/schema";
import type {
  CreateVendorInput,
  UpdateVendorInput,
  VendorModel,
} from "../type";

export async function getVendorById(id: number): Promise<VendorModel | null> {
  const rows = await db
    .select()
    .from(Vendors)
    .where(eq(Vendors.id, id))
    .limit(1);

  return (rows[0] as VendorModel | undefined) ?? null;
}

export async function findVendorByPanOrgstin(
  panOrgstin: string,
): Promise<VendorModel | null> {
  const rows = await db
    .select()
    .from(Vendors)
    .where(eq(Vendors.panOrgstin, panOrgstin))
    .limit(1);

  return (rows[0] as VendorModel | undefined) ?? null;
}

export async function createVendor(
  input: CreateVendorInput & {
    name: string;
    category: string;
    headquater: string;
    panOrgstin: string;
    value: number;
    status: string;
  },
  createdBy: number,
): Promise<VendorModel> {
  const payload: typeof Vendors.$inferInsert = {
    name: input.name,
    category: input.category,
    headquater: input.headquater,
    panOrgstin: input.panOrgstin,
    value: input.value,
    status: input.status,
    createdBy,
  };

  const rows = await db.insert(Vendors).values(payload).returning();
  return rows[0] as VendorModel;
}

export async function getVendors(): Promise<VendorModel[]> {
  return db.select().from(Vendors);
}

export async function updateVendor(
  id: number,
  input: UpdateVendorInput,
): Promise<VendorModel | null> {
  const rows = await db
    .update(Vendors)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.category && { category: input.category }),
      ...(input.headquater && { headquater: input.headquater }),
      ...(input.value !== undefined && { value: input.value }),
      ...(input.status && { status: input.status }),
    })
    .where(eq(Vendors.id, id))
    .returning();

  return (rows[0] as VendorModel | undefined) ?? null;
}

export async function deleteVendor(id: number): Promise<boolean> {
  const rows = await db.delete(Vendors).where(eq(Vendors.id, id)).returning();
  return rows.length > 0;
}
