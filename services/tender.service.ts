import { HTTP_STATUS } from "../constant/http.constant";
import {
  createTender,
  findTenderByContractNo,
  getTenders,
} from "../repository/tender.repository";
import type { CreateTenderInput, ServiceResult, TenderModel } from "../type";

export async function createTenderService(
  input: CreateTenderInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; tender: TenderModel }>> {
  if (!input.nameOfWork?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Name of work is required",
    };
  }

  if (!input.natureOfWorkBriefDescription?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Nature of work & brief description is required",
    };
  }

  if (!input.clientNameAddress?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Client name & address is required",
    };
  }

  if (!input.contractNo?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Contract number is required",
    };
  }

  if (input.value === undefined || input.value <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Value must be greater than 0",
    };
  }

  if (!input.date?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Date is required",
    };
  }

  const contractNo = input.contractNo.trim();
  const existing = await findTenderByContractNo(contractNo);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Contract number already exists",
    };
  }

  const tender = await createTender(
    {
      nameOfWork: input.nameOfWork.trim(),
      natureOfWorkBriefDescription: input.natureOfWorkBriefDescription.trim(),
      clientNameAddress: input.clientNameAddress.trim(),
      contractNo,
      value: input.value,
      date: input.date.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Tender created successfully",
      tender,
    },
  };
}

export async function getTendersService(): Promise<
  ServiceResult<{ tenders: TenderModel[] }>
> {
  const tenders = await getTenders();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { tenders },
  };
}
