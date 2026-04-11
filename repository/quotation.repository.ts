import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Quotations } from "../db/schema";
import type {
  CreateQuotationInput,
  QuotationModel,
  UpdateQuotationInput,
} from "../type";

export async function getQuotationById(
  id: number,
): Promise<QuotationModel | null> {
  const rows = await db
    .select()
    .from(Quotations)
    .where(eq(Quotations.id, id))
    .limit(1);

  return (rows[0] as QuotationModel | undefined) ?? null;
}

export async function createQuotation(
  input: CreateQuotationInput & {
    quotationDetails: string;
    projectId: number;
    quoteValue: number;
    version: string;
    status: string;
  },
  createdBy: number,
): Promise<QuotationModel> {
  const payload: typeof Quotations.$inferInsert = {
    quotationDetails: input.quotationDetails,
    projectId: input.projectId,
    quoteValue: input.quoteValue,
    version: input.version,
    status: input.status,
    createdBy,
  };

  const rows = await db.insert(Quotations).values(payload).returning();
  return rows[0] as QuotationModel;
}

export async function getQuotations(): Promise<QuotationModel[]> {
  return db.select().from(Quotations);
}

export async function updateQuotation(
  id: number,
  input: UpdateQuotationInput,
): Promise<QuotationModel | null> {
  const rows = await db
    .update(Quotations)
    .set({
      ...(input.quotationDetails && {
        quotationDetails: input.quotationDetails,
      }),
      ...(input.projectId !== undefined && { projectId: input.projectId }),
      ...(input.quoteValue !== undefined && { quoteValue: input.quoteValue }),
      ...(input.version && { version: input.version }),
      ...(input.status && { status: input.status }),
    })
    .where(eq(Quotations.id, id))
    .returning();

  return (rows[0] as QuotationModel | undefined) ?? null;
}

export async function deleteQuotation(id: number): Promise<boolean> {
  const rows = await db
    .delete(Quotations)
    .where(eq(Quotations.id, id))
    .returning();
  return rows.length > 0;
}
