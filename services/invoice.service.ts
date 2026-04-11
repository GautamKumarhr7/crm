import { HTTP_STATUS } from "../constant/http.constant";
import {
  createInvoice,
  deleteInvoice,
  findInvoiceByInvoiceId,
  getInvoiceById,
  getInvoices,
  getInvoicesByProjectId,
  updateInvoice,
} from "../repository/invoice.repository";
import type {
  CreateInvoiceInput,
  InvoiceModel,
  ServiceResult,
  UpdateInvoiceInput,
} from "../type";

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

  const billType = input.billType?.trim() || input.type?.trim();

  if (!billType) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Bill Type is required",
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
      clientOrProject: input.clientOrProject?.trim() || billType,
      type: billType,
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

export async function getInvoiceByIdService(
  id: number,
): Promise<ServiceResult<{ invoice: InvoiceModel }>> {
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Invoice not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { invoice },
  };
}

export async function updateInvoiceService(
  id: number,
  input: UpdateInvoiceInput,
): Promise<ServiceResult<{ message: string; invoice: InvoiceModel }>> {
  if (input.amount !== undefined && input.amount <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Amount must be greater than 0",
    };
  }

  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Invoice not found",
    };
  }

  if (input.invoiceId?.trim() && input.invoiceId.trim() !== invoice.invoiceId) {
    const existing = await findInvoiceByInvoiceId(input.invoiceId.trim());
    if (existing) {
      return {
        ok: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Invoice ID already exists",
      };
    }
  }

  const billType = input.billType?.trim() || input.type?.trim();

  const updated = await updateInvoice(id, {
    ...(input.invoiceId?.trim() && { invoiceId: input.invoiceId.trim() }),
    ...(input.projectId !== undefined && { projectId: input.projectId }),
    ...(input.clientOrProject?.trim() && {
      clientOrProject: input.clientOrProject.trim(),
    }),
    ...(billType && { type: billType }),
    ...(input.date?.trim() && { date: input.date.trim() }),
    ...(input.gst !== undefined && { gst: input.gst }),
    ...(input.retention !== undefined && { retention: input.retention }),
    ...(input.amount !== undefined && { amount: input.amount }),
    ...(input.status?.trim() && { status: input.status.trim() }),
  });

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update invoice",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Invoice updated successfully",
      invoice: updated,
    },
  };
}

export async function deleteInvoiceService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Invoice not found",
    };
  }

  const deleted = await deleteInvoice(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete invoice",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { message: "Invoice deleted successfully" },
  };
}
