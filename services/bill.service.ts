import { HTTP_STATUS } from "../constant/http.constant";
import {
  createBill,
  findBillByCode,
  getBills,
} from "../repository/bill.repository";
import type { BillModel, CreateBillInput, ServiceResult } from "../type";

export async function createBillService(
  input: CreateBillInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; bill: BillModel }>> {
  if (!input.code?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Bill code is required",
    };
  }

  const code = input.code.trim();
  const existingBill = await findBillByCode(code);

  if (existingBill) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Bill code already exists",
    };
  }

  const bill = await createBill(
    {
      ...input,
      code,
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Bill created successfully",
      bill,
    },
  };
}

export async function getBillsService(): Promise<
  ServiceResult<{ bills: BillModel[] }>
> {
  const bills = await getBills();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { bills },
  };
}
