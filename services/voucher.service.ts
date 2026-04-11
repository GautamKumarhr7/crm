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

  if (input.amount === undefined || input.amount <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Amount must be greater than 0",
    };
  }

  if (input.tdsDeductions === undefined || input.tdsDeductions < 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "TDS / Deductions is required",
    };
  }

  if (!input.secondaryPartyAccount?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Secondary party / account is required",
    };
  }

  if (!input.narrationRemarks?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Narration / remarks is required",
    };
  }

  const voucher = await createVoucher(
    {
      type: input.type.trim(),
      date: input.date.trim(),
      amount: input.amount,
      tdsDeductions: input.tdsDeductions,
      secondaryPartyAccount: input.secondaryPartyAccount.trim(),
      narrationRemarks: input.narrationRemarks.trim(),
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
  if (input.amount !== undefined && input.amount <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Amount must be greater than 0",
    };
  }

  if (input.tdsDeductions !== undefined && input.tdsDeductions < 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "TDS / Deductions is required",
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
    ...(input.amount !== undefined && { amount: input.amount }),
    ...(input.tdsDeductions !== undefined && {
      tdsDeductions: input.tdsDeductions,
    }),
    ...(input.secondaryPartyAccount?.trim() && {
      secondaryPartyAccount: input.secondaryPartyAccount.trim(),
    }),
    ...(input.narrationRemarks?.trim() && {
      narrationRemarks: input.narrationRemarks.trim(),
    }),
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
