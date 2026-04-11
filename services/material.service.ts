import { HTTP_STATUS } from "../constant/http.constant";
import {
  createMaterial,
  getMaterials,
} from "../repository/material.repository";
import type {
  CreateMaterialInput,
  MaterialModel,
  ServiceResult,
} from "../type";

export async function createMaterialService(
  input: CreateMaterialInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; material: MaterialModel }>> {
  if (!input.materialName?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Material name is required",
    };
  }

  if (!input.category?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Category is required",
    };
  }

  if (!input.warehouseLocation?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Warehouse location is required",
    };
  }

  if (input.quantity === undefined || input.quantity <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Quantity must be greater than 0",
    };
  }

  if (!input.quantityType?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "quantityType is required",
    };
  }

  if (input.avgPurchaseRate === undefined || input.avgPurchaseRate <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Avg purchase rate must be greater than 0",
    };
  }

  const material = await createMaterial(
    {
      materialName: input.materialName.trim(),
      category: input.category.trim(),
      warehouseLocation: input.warehouseLocation.trim(),
      quantity: input.quantity,
      quantityType: input.quantityType.trim(),
      avgPurchaseRate: input.avgPurchaseRate,
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Material created successfully",
      material,
    },
  };
}

export async function getMaterialsService(): Promise<
  ServiceResult<{ materials: MaterialModel[] }>
> {
  const materials = await getMaterials();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { materials },
  };
}
