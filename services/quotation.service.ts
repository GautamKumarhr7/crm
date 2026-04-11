import { HTTP_STATUS } from "../constant/http.constant";
import {
  createQuotation,
  getQuotations,
} from "../repository/quotation.repository";
import type {
  CreateQuotationInput,
  QuotationModel,
  ServiceResult,
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
