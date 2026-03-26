import { HTTP_STATUS } from "../constant/http.constant";
import {
  createProcurement,
  findProcurementByPoNumber,
  getProcurements,
} from "../repository/procurement.repository";
import type {
  CreateProcurementInput,
  ProcurementModel,
  ServiceResult,
} from "../type";

export async function createProcurementService(
  input: CreateProcurementInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; procurement: ProcurementModel }>> {
  if (!input.poNumber?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "PO number is required",
    };
  }

  if (!input.vendor?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Vendor is required",
    };
  }

  if (!input.items?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Items is required",
    };
  }

  if (input.amount === undefined || input.amount <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Amount must be greater than 0",
    };
  }

  if (!input.raised?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Raised date is required",
    };
  }

  if (!input.expectedDelivery?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Expected delivery date is required",
    };
  }

  if (!input.progress?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Progress is required",
    };
  }

  if (!input.status?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Status is required",
    };
  }

  const poNumber = input.poNumber.trim();
  const existing = await findProcurementByPoNumber(poNumber);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "PO number already exists",
    };
  }

  const procurement = await createProcurement(
    {
      poNumber,
      vendor: input.vendor.trim(),
      items: input.items.trim(),
      amount: input.amount,
      raised: input.raised.trim(),
      expectedDelivery: input.expectedDelivery.trim(),
      progress: input.progress.trim(),
      status: input.status.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Procurement created successfully",
      procurement,
    },
  };
}

export async function getProcurementsService(): Promise<
  ServiceResult<{ procurements: ProcurementModel[] }>
> {
  const procurements = await getProcurements();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { procurements },
  };
}
