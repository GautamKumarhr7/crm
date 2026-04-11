import { HTTP_STATUS } from "../constant/http.constant";
import {
  createQuotation,
  deleteQuotation,
  getQuotationById,
  getQuotations,
  updateQuotation,
} from "../repository/quotation.repository";
import type {
  CreateQuotationInput,
  QuotationModel,
  ServiceResult,
  UpdateQuotationInput,
} from "../type";

export async function createQuotationService(
  input: CreateQuotationInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; quotation: QuotationModel }>> {
  if (!input.quotationDetails?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Quotation details is required",
    };
  }

  if (!input.projectId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "projectId is required",
    };
  }

  if (input.quoteValue === undefined || input.quoteValue <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Quote value must be greater than 0",
    };
  }

  if (!input.version?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Version is required",
    };
  }

  if (!input.status?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Status is required",
    };
  }

  const quotation = await createQuotation(
    {
      quotationDetails: input.quotationDetails.trim(),
      projectId: input.projectId,
      quoteValue: input.quoteValue,
      version: input.version.trim(),
      status: input.status.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Quotation created successfully",
      quotation,
    },
  };
}

export async function getQuotationsService(): Promise<
  ServiceResult<{ quotations: QuotationModel[] }>
> {
  const quotations = await getQuotations();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { quotations },
  };
}

export async function getQuotationByIdService(
  id: number,
): Promise<ServiceResult<{ quotation: QuotationModel }>> {
  const quotation = await getQuotationById(id);

  if (!quotation) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Quotation not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { quotation },
  };
}

export async function updateQuotationService(
  id: number,
  input: UpdateQuotationInput,
): Promise<ServiceResult<{ message: string; quotation: QuotationModel }>> {
  if (input.quoteValue !== undefined && input.quoteValue <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Quote value must be greater than 0",
    };
  }

  const quotation = await getQuotationById(id);

  if (!quotation) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Quotation not found",
    };
  }

  const updated = await updateQuotation(id, {
    ...(input.quotationDetails?.trim() && {
      quotationDetails: input.quotationDetails.trim(),
    }),
    ...(input.projectId !== undefined && { projectId: input.projectId }),
    ...(input.quoteValue !== undefined && { quoteValue: input.quoteValue }),
    ...(input.version?.trim() && { version: input.version.trim() }),
    ...(input.status?.trim() && { status: input.status.trim() }),
  });

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update quotation",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Quotation updated successfully",
      quotation: updated,
    },
  };
}

export async function deleteQuotationService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const quotation = await getQuotationById(id);

  if (!quotation) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Quotation not found",
    };
  }

  const deleted = await deleteQuotation(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete quotation",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { message: "Quotation deleted successfully" },
  };
}
