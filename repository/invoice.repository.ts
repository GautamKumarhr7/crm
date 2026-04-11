import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Invoices } from "../db/schema";
import type {
  CreateInvoiceInput,
  InvoiceModel,
  UpdateInvoiceInput,
} from "../type";

export async function getInvoiceById(id: number): Promise<InvoiceModel | null> {
  const rows = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  return (rows[0] as InvoiceModel | undefined) ?? null;
}

export async function findInvoiceByInvoiceId(
  invoiceId: string,
): Promise<InvoiceModel | null> {
  const rows = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.invoiceId, invoiceId))
    .limit(1);

  return (rows[0] as InvoiceModel | undefined) ?? null;
}

export async function createInvoice(
  input: CreateInvoiceInput & {
    invoiceId: string;
    projectId: number;
    clientOrProject: string;
    type: string;
    date: string;
    gst: number;
    retention: number;
    amount: number;
    status: string;
  },
  createdBy: number,
): Promise<InvoiceModel> {
  const payload: typeof Invoices.$inferInsert = {
    invoiceId: input.invoiceId,
    projectId: input.projectId,
    clientOrProject: input.clientOrProject,
    type: input.type,
    date: input.date,
    gst: input.gst,
    retention: input.retention,
    amount: input.amount,
    status: input.status,
    createdBy,
  };

  const rows = await db.insert(Invoices).values(payload).returning();
  return rows[0] as InvoiceModel;
}

export async function getInvoices(): Promise<InvoiceModel[]> {
  return db.select().from(Invoices);
}

export async function getInvoicesByProjectId(
  projectId: number,
): Promise<InvoiceModel[]> {
  return db.select().from(Invoices).where(eq(Invoices.projectId, projectId));
}

export async function updateInvoice(
  id: number,
  input: UpdateInvoiceInput,
): Promise<InvoiceModel | null> {
  const rows = await db
    .update(Invoices)
    .set({
      ...(input.invoiceId && { invoiceId: input.invoiceId }),
      ...(input.projectId !== undefined && { projectId: input.projectId }),
      ...(input.clientOrProject && { clientOrProject: input.clientOrProject }),
      ...(input.type && { type: input.type }),
      ...(input.date && { date: input.date }),
      ...(input.gst !== undefined && { gst: input.gst }),
      ...(input.retention !== undefined && { retention: input.retention }),
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.status && { status: input.status }),
    })
    .where(eq(Invoices.id, id))
    .returning();

  return (rows[0] as InvoiceModel | undefined) ?? null;
}

export async function deleteInvoice(id: number): Promise<boolean> {
  const rows = await db.delete(Invoices).where(eq(Invoices.id, id)).returning();
  return rows.length > 0;
}
