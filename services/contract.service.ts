import { HTTP_STATUS } from "../constant/http.constant";
import {
  createContract,
  findContractByContractId,
  getContracts,
} from "../repository/contract.repository";
import type {
  ContractModel,
  CreateContractInput,
  ServiceResult,
} from "../type";

export async function createContractService(
  input: CreateContractInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; contract: ContractModel }>> {
  if (!input.contractId?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "contractId is required",
    };
  }

  if (!input.projectId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "projectId is required",
    };
  }

  if (input.value === undefined || input.value <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Value must be greater than 0",
    };
  }

  if (!input.period?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Period is required",
    };
  }

  if (!input.status?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Status is required",
    };
  }

  const contractId = input.contractId.trim();
  const existing = await findContractByContractId(contractId);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "contractId already exists",
    };
  }

  const contract = await createContract(
    {
      contractId,
      projectId: input.projectId,
      value: input.value,
      period: input.period.trim(),
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
