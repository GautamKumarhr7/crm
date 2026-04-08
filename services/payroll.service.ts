import { HTTP_STATUS } from "../constant/http.constant";
import {
  createPayroll,
  findPayrollUserById,
  getPayrolls,
  getPayrollsByUserId,
} from "../repository/payroll.repository";
import type {
  CreatePayrollInput,
  PayrollModel,
  PayrollWithUser,
  ServiceResult,
} from "../type";

const MONEY_TOLERANCE = 0.01;

function isMissing(value?: number): boolean {
  return value === undefined || value === null;
}

function isNegative(value: number): boolean {
  return value < 0;
}

export async function createPayrollService(
  input: CreatePayrollInput,
): Promise<ServiceResult<{ message: string; payroll: PayrollModel }>> {
  if (!input.userId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId is required",
    };
  }

  if (!input.createdBy) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "createdBy is required",
    };
  }

  if (
    isMissing(input.basicPay) ||
    isMissing(input.hra) ||
    isMissing(input.conveyance) ||
    isMissing(input.specialBonus)
  ) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message:
        "basicPay, hra, conveyance, and specialBonus are required fields",
    };
  }

  const basicPay = Number(input.basicPay);
  const hra = Number(input.hra);
  const conveyance = Number(input.conveyance);
  const specialBonus = Number(input.specialBonus);
  const pfContribution = Number(input.pfContribution ?? 0);
  const esi = Number(input.esi ?? 0);
  const tdsTax = Number(input.tdsTax ?? 0);

  if (
    [basicPay, hra, conveyance, specialBonus, pfContribution, esi, tdsTax].some(
      (value) => Number.isNaN(value) || !Number.isFinite(value),
    )
  ) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Payroll values must be valid numbers",
    };
  }

  if (
    isNegative(basicPay) ||
    isNegative(hra) ||
    isNegative(conveyance) ||
    isNegative(specialBonus) ||
    isNegative(pfContribution) ||
    isNegative(esi) ||
    isNegative(tdsTax)
  ) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Payroll values cannot be negative",
    };
  }

  const user = await findPayrollUserById(input.userId);
  if (!user) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "User not found for provided userId",
    };
  }

  if (user.sallery === null || user.sallery === undefined) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "User salary details are not set",
    };
  }

  if (!user.pfDeduction && pfContribution > 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message:
        "PF contribution must be 0 because PF deduction is disabled for this user",
    };
  }

  if (!user.esiDeduction && esi > 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "ESI must be 0 because ESI deduction is disabled for this user",
    };
  }

  const salaryFromUser = Number(user.sallery);

  if (Math.abs(basicPay - salaryFromUser) > MONEY_TOLERANCE) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: `Basic pay (${basicPay}) must match user's salary (${salaryFromUser})`,
    };
  }

  const payroll = await createPayroll({
    userId: input.userId,
    basicPay,
    hra,
    conveyance,
    specialBonus,
    pfContribution,
    esi,
    tdsTax,
    createdBy: input.createdBy,
  });

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Payroll created successfully",
      payroll,
    },
  };
}

export async function getPayrollsService(): Promise<
  ServiceResult<{ payrolls: PayrollWithUser[] }>
> {
  const payrolls = await getPayrolls();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { payrolls },
  };
}

export async function getPayrollsByUserIdService(
  userId: number,
): Promise<ServiceResult<{ payrolls: PayrollWithUser[] }>> {
  if (!userId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId is required",
    };
  }

  const payrolls = await getPayrollsByUserId(userId);

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { payrolls },
  };
}
