import { HTTP_STATUS } from "../constant/http.constant";
import {
  createTender,
  deleteTender,
  findTenderByContractId,
  getTenderById,
  getTenders,
  updateTender,
} from "../repository/tender.repository";
import type {
  CreateTenderInput,
  ServiceResult,
  TenderModel,
  UpdateTenderInput,
} from "../type";

export async function createTenderService(
  input: CreateTenderInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; tender: TenderModel }>> {
  const name = input.Name?.trim();
  const description = input.Description?.trim();
  const nameAddress = input.NameAddress;
  const contractId = input.ContractId?.trim();
  const value = input.Value;
  const date = input.Date?.trim();

  if (!name) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Name is required",
    };
  }

  if (!description) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Description is required",
    };
  }

  if (!nameAddress || nameAddress.length === 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Name & Address is required",
    };
  }

  if (!contractId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "ContractId is required",
    };
  }

  if (value === undefined || value <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Value must be greater than 0",
    };
  }

  if (!date) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Date is required",
    };
  }

  const existing = await findTenderByContractId(contractId);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "ContractId already exists",
    };
  }

  const tender = await createTender(
    {
      name,
      description,
      nameAddress,
      contractId,
      value,
      date,
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

export async function getTenderByIdService(
  id: number,
): Promise<ServiceResult<{ tender: TenderModel }>> {
  const tender = await getTenderById(id);

  if (!tender) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Tender not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { tender },
  };
}

export async function updateTenderService(
  id: number,
  input: UpdateTenderInput,
): Promise<ServiceResult<{ message: string; tender: TenderModel }>> {
  const tender = await getTenderById(id);

  if (!tender) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Tender not found",
    };
  }

  const updated = await updateTender(id, input);

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update tender",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Tender updated successfully",
      tender: updated,
    },
  };
}

export async function deleteTenderService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const tender = await getTenderById(id);

  if (!tender) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Tender not found",
    };
  }

  const deleted = await deleteTender(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete tender",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Tender deleted successfully",
    },
  };
}
