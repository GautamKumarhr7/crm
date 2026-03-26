import { HTTP_STATUS } from "../constant/http.constant";
import {
  createInvoice,
  findInvoiceByInvoiceId,
  getInvoices,
  getInvoicesByProjectId,
} from "../repository/invoice.repository";
import type { CreateInvoiceInput, InvoiceModel, ServiceResult } from "../type";

export async function createInvoiceService(
  input: CreateInvoiceInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; invoice: InvoiceModel }>> {
  if (!input.invoiceId?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Invoice ID is required",
    };
  }

  if (!input.projectId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "projectId is required",
    };
  }

  if (!input.clientOrProject?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Client / Project is required",
    };
  }

  if (!input.type?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Type is required",
    };
  }

  if (!input.date?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Date is required",
    };
  }

  if (input.amount === undefined || input.amount <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Amount must be greater than 0",
    };
  }

  if (!input.status?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Status is required",
    };
  }

  const invoiceId = input.invoiceId.trim();
  const existing = await findInvoiceByInvoiceId(invoiceId);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Invoice ID already exists",
    };
  }

  const invoice = await createInvoice(
    {
      invoiceId,
      projectId: input.projectId,
      clientOrProject: input.clientOrProject.trim(),
      type: input.type.trim(),
      date: input.date.trim(),
      gst: input.gst ?? 18,
      retention: input.retention ?? 0,
      amount: input.amount,
      status: input.status.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Invoice created successfully",
      invoice,
    },
  };
}

export async function getInvoicesService(): Promise<
  ServiceResult<{ invoices: InvoiceModel[] }>
> {
  const invoices = await getInvoices();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { invoices },
  };
}

export async function getInvoicesByProjectIdService(
  projectId: number,
): Promise<ServiceResult<{ invoices: InvoiceModel[] }>> {
  if (!projectId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "projectId is required",
    };
  }

  const invoices = await getInvoicesByProjectId(projectId);

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { invoices },
  };
}
