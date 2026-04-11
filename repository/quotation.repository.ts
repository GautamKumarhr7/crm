import { db } from "../db/connection";
import { Quotations } from "../db/schema";
import type { CreateQuotationInput, QuotationModel } from "../type";

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
