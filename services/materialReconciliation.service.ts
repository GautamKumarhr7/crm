import { HTTP_STATUS } from "../constant/http.constant";
import {
  createMaterialReconciliation,
  getMaterialReconciliations,
} from "../repository/materialReconciliation.repository";
import type {
  CreateMaterialReconciliationInput,
  MaterialReconciliationModel,
  ServiceResult,
} from "../type";

export async function createMaterialReconciliationService(
  input: CreateMaterialReconciliationInput,
  createdBy: number,
): Promise<
  ServiceResult<{
    message: string;
    materialReconciliation: MaterialReconciliationModel;
  }>
> {
  if (!input.billCode?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Bill code is required",
    };
  }

  if (!input.description?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Description is required",
    };
  }

  if (!input.unit?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Unit is required",
    };
  }

  if (input.contRate === undefined || input.subRate === undefined) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Cont. rate and sub rate are required",
    };
  }

  if (input.poQty === undefined || input.billedQty === undefined) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "PO qty and billed qty are required",
    };
  }

  const contTotal = input.contTotal ?? input.contRate * input.poQty;
  const diffQty = input.diffQty ?? input.poQty - input.billedQty;
  const diffValue = input.diffValue ?? diffQty * input.contRate;

  const status = input.status?.trim() || "Reconciled";

  const materialReconciliation = await createMaterialReconciliation(
    {
      billCode: input.billCode.trim(),
      description: input.description.trim(),
      unit: input.unit.trim(),
      contRate: input.contRate,
      subRate: input.subRate,
      poQty: input.poQty,
      billedQty: input.billedQty,
      contTotal,
      diffQty,
      diffValue,
      status,
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Material reconciliation created successfully",
      materialReconciliation,
    },
  };
}

export async function getMaterialReconciliationsService(): Promise<
  ServiceResult<{ materialReconciliations: MaterialReconciliationModel[] }>
> {
  const materialReconciliations = await getMaterialReconciliations();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { materialReconciliations },
  };
}
