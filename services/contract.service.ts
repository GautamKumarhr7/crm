import { HTTP_STATUS } from "../constant/http.constant";
import {
  createContract,
  deleteContract,
  findContractByReferenceId,
  getContractById,
  getContracts,
  updateContract,
} from "../repository/contract.repository";
import type {
  ContractModel,
  CreateContractInput,
  ServiceResult,
  UpdateContractInput,
} from "../type";

export async function createContractService(
  input: CreateContractInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; contract: ContractModel }>> {
  if (!input.referenceId?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "referenceId is required",
    };
  }

  if (!input.projectId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "projectId is required",
    };
  }

  if (input.contractValue === undefined || input.contractValue <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "contractValue must be greater than 0",
    };
  }

  if (!input.validity?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "validity is required",
    };
  }

  if (!input.status?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "status is required",
    };
  }

  const referenceId = input.referenceId.trim();
  const existing = await findContractByReferenceId(referenceId);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "referenceId already exists",
    };
  }

  const contract = await createContract(
    {
      referenceId,
      projectId: input.projectId,
      contractValue: input.contractValue,
      validity: input.validity.trim(),
      status: input.status.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Contract created successfully",
      contract,
    },
  };
}

export async function getContractsService(): Promise<
  ServiceResult<{ contracts: ContractModel[] }>
> {
  const contracts = await getContracts();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { contracts },
  };
}

export async function getContractByIdService(
  id: number,
): Promise<ServiceResult<{ contract: ContractModel }>> {
  const contract = await getContractById(id);

  if (!contract) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Contract not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { contract },
  };
}

export async function updateContractService(
  id: number,
  input: UpdateContractInput,
): Promise<ServiceResult<{ message: string; contract: ContractModel }>> {
  const contract = await getContractById(id);

  if (!contract) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Contract not found",
    };
  }

  const updated = await updateContract(id, input);

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update contract",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Contract updated successfully",
      contract: updated,
    },
  };
}

export async function deleteContractService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const contract = await getContractById(id);

  if (!contract) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Contract not found",
    };
  }

  const deleted = await deleteContract(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete contract",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Contract deleted successfully",
    },
  };
}
