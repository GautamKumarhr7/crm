import { HTTP_STATUS } from "../constant/http.constant";
import {
  createMaterial,
  deleteMaterial,
  getMaterialById,
  getMaterials,
  updateMaterial,
} from "../repository/material.repository";
import type {
  CreateMaterialInput,
  MaterialModel,
  ServiceResult,
  UpdateMaterialInput,
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

export async function getMaterialByIdService(
  id: number,
): Promise<ServiceResult<{ material: MaterialModel }>> {
  const material = await getMaterialById(id);

  if (!material) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Material not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { material },
  };
}

export async function updateMaterialService(
  id: number,
  input: UpdateMaterialInput,
): Promise<ServiceResult<{ message: string; material: MaterialModel }>> {
  if (input.quantity !== undefined && input.quantity <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Quantity must be greater than 0",
    };
  }

  if (input.avgPurchaseRate !== undefined && input.avgPurchaseRate <= 0) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Avg purchase rate must be greater than 0",
    };
  }

  const material = await getMaterialById(id);

  if (!material) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Material not found",
    };
  }

  const updated = await updateMaterial(id, {
    ...(input.materialName?.trim() && {
      materialName: input.materialName.trim(),
    }),
    ...(input.category?.trim() && { category: input.category.trim() }),
    ...(input.warehouseLocation?.trim() && {
      warehouseLocation: input.warehouseLocation.trim(),
    }),
    ...(input.quantity !== undefined && { quantity: input.quantity }),
    ...(input.quantityType?.trim() && {
      quantityType: input.quantityType.trim(),
    }),
    ...(input.avgPurchaseRate !== undefined && {
      avgPurchaseRate: input.avgPurchaseRate,
    }),
  });

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update material",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Material updated successfully",
      material: updated,
    },
  };
}

export async function deleteMaterialService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const material = await getMaterialById(id);

  if (!material) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Material not found",
    };
  }

  const deleted = await deleteMaterial(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete material",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { message: "Material deleted successfully" },
  };
}
