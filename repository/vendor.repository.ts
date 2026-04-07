import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Vendors } from "../db/schema";
import type { CreateVendorInput, VendorModel } from "../type";

export async function findVendorByGstinOrPan(
  gstinOrPan: string,
): Promise<VendorModel | null> {
  const rows = await db
    .select()
    .from(Vendors)
    .where(eq(Vendors.gstinOrPan, gstinOrPan))
    .limit(1);

  return (rows[0] as VendorModel | undefined) ?? null;
}

export async function createVendor(
  input: CreateVendorInput & {
    name: string;
    category: string;
    city: string;
    complianceTax: string;
    gstinOrPan: string;
    status: string;
  },
  createdBy: number,
): Promise<VendorModel> {
  const payload: typeof Vendors.$inferInsert = {
    name: input.name,
    category: input.category,
    city: input.city,
    complianceTax: input.complianceTax,
    gstinOrPan: input.gstinOrPan,
    status: input.status,
    createdBy,
  };

  const rows = await db.insert(Vendors).values(payload).returning();
  return rows[0] as VendorModel;
}

export async function getVendors(): Promise<VendorModel[]> {
  return db.select().from(Vendors);
}
