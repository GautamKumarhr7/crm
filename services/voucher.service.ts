import { HTTP_STATUS } from "../constant/http.constant";
import {
  createVoucher,
  deleteVoucher,
  getVoucherById,
  getVouchers,
  updateVoucher,
} from "../repository/voucher.repository";
import type {
  CreateVoucherInput,
  ServiceResult,
  UpdateVoucherInput,
  VoucherModel,
} from "../type";

export async function createVoucherService(
  input: CreateVoucherInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; voucher: VoucherModel }>> {
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

  const voucher = await createVoucher(
    {
      type: input.type.trim(),
      date: input.date.trim(),
      ...(input.partyId !== undefined && { partyId: input.partyId }),
      ...(input.materialId !== undefined && { materialId: input.materialId }),
      ...(input.quantity !== undefined && { quantity: input.quantity }),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Voucher created successfully",
      voucher,
    },
  };
}

export async function getVouchersService(): Promise<
  ServiceResult<{ vouchers: VoucherModel[] }>
> {
  const vouchers = await getVouchers();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { vouchers },
  };
}

export async function getVoucherByIdService(
  id: number,
): Promise<ServiceResult<{ voucher: VoucherModel }>> {
  const voucher = await getVoucherById(id);

  if (!voucher) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Voucher not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { voucher },
  };
}

export async function updateVoucherService(
  id: number,
  input: UpdateVoucherInput,
): Promise<ServiceResult<{ message: string; voucher: VoucherModel }>> {
  if (
    input.partyId !== undefined &&
    (!Number.isInteger(input.partyId) || input.partyId <= 0)
  ) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "partyId must be a positive integer",
    };
  }

  if (
    input.materialId !== undefined &&
    (!Number.isInteger(input.materialId) || input.materialId <= 0)
  ) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "materialId must be a positive integer",
    };
  }

  if (
    input.quantity !== undefined &&
    (typeof input.quantity !== "number" ||
      Number.isNaN(input.quantity) ||
      input.quantity <= 0)
  ) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "quantity must be a number greater than 0",
    };
  }

  const voucher = await getVoucherById(id);

  if (!voucher) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Voucher not found",
    };
  }

  const updated = await updateVoucher(id, {
    ...(input.type?.trim() && { type: input.type.trim() }),
    ...(input.date?.trim() && { date: input.date.trim() }),
    ...(input.partyId !== undefined && { partyId: input.partyId }),
    ...(input.materialId !== undefined && { materialId: input.materialId }),
    ...(input.quantity !== undefined && { quantity: input.quantity }),
  });

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update voucher",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Voucher updated successfully",
      voucher: updated,
    },
  };
}

export async function deleteVoucherService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const voucher = await getVoucherById(id);

  if (!voucher) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Voucher not found",
    };
  }

  const deleted = await deleteVoucher(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete voucher",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { message: "Voucher deleted successfully" },
  };
}
