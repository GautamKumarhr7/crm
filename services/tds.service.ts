import { HTTP_STATUS } from "../constant/http.constant";
import {
  createTds,
  deleteTds,
  findTdsByTdsId,
  getTds,
  getTdsById,
  updateTds,
} from "../repository/tds.repository";
import type {
  CreateTdsInput,
  ServiceResult,
  TdsModel,
  UpdateTdsInput,
} from "../type";

export async function createTdsService(
  input: CreateTdsInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; tds: TdsModel }>> {
  if (!input.tdsId?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "TDS ID is required",
    };
  }

  if (!input.vendorId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "vendorId is required",
    };
  }

  if (!input.section?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Section is required",
    };
  }

  if (!input.date?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Date is required",
    };
  }

  if (!input.period?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Period is required",
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

  const tdsId = input.tdsId.trim();
  const existing = await findTdsByTdsId(tdsId);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "TDS ID already exists",
    };
  }

  const referenceValue = input.reference?.trim();
  const reference =
    referenceValue && referenceValue !== "-" ? referenceValue : undefined;

  const tds = await createTds(
    {
      tdsId,
      vendorId: input.vendorId,
      section: input.section.trim(),
      date: input.date.trim(),
      period: input.period.trim(),
      ...(reference && { reference }),
      amount: input.amount,
      status: input.status.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "TDS created successfully",
      tds,
    },
  };
}

export async function getTdsService(): Promise<
  ServiceResult<{ tds: TdsModel[] }>
> {
  const tds = await getTds();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { tds },
  };
}

export async function getTdsByIdService(
  id: number,
): Promise<ServiceResult<{ tds: TdsModel }>> {
  const tds = await getTdsById(id);

  if (!tds) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "TDS not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { tds },
  };
}

export async function updateTdsService(
  id: number,
  input: UpdateTdsInput,
): Promise<ServiceResult<{ message: string; tds: TdsModel }>> {
  if (input.amount !== undefined && input.amount <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Amount must be greater than 0",
    };
  }

  const existingTds = await getTdsById(id);

  if (!existingTds) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "TDS not found",
    };
  }

  if (input.tdsId?.trim() && input.tdsId.trim() !== existingTds.tdsId) {
    const existingByCode = await findTdsByTdsId(input.tdsId.trim());
    if (existingByCode) {
      return {
        ok: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: "TDS ID already exists",
      };
    }
  }

  const referenceValue = input.reference?.trim();
  const reference =
    referenceValue && referenceValue !== "-" ? referenceValue : undefined;

  const updatePayload: UpdateTdsInput = {
    ...(input.tdsId?.trim() && { tdsId: input.tdsId.trim() }),
    ...(input.vendorId !== undefined && { vendorId: input.vendorId }),
    ...(input.section?.trim() && { section: input.section.trim() }),
    ...(input.date?.trim() && { date: input.date.trim() }),
    ...(input.period?.trim() && { period: input.period.trim() }),
    ...(input.amount !== undefined && { amount: input.amount }),
    ...(input.status?.trim() && { status: input.status.trim() }),
  };

  if (input.reference !== undefined && reference) {
    updatePayload.reference = reference;
  }

  const updated = await updateTds(id, updatePayload);

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update TDS",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "TDS updated successfully",
      tds: updated,
    },
  };
}

export async function deleteTdsService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const existingTds = await getTdsById(id);

  if (!existingTds) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "TDS not found",
    };
  }

  const deleted = await deleteTds(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete TDS",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { message: "TDS deleted successfully" },
  };
}
