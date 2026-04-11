import { HTTP_STATUS } from "../constant/http.constant";
import {
  createEquipment,
  deleteEquipment,
  getEquipmentById,
  getEquipments,
  updateEquipment,
} from "../repository/equipment.repository";
import type {
  CreateEquipmentInput,
  EquipmentModel,
  ServiceResult,
  UpdateEquipmentInput,
} from "../type";

export async function createEquipmentService(
  input: CreateEquipmentInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; equipment: EquipmentModel }>> {
  if (!input.equipmentName?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Equipment name is required",
    };
  }

  if (!input.category?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Category is required",
    };
  }

  if (!input.registrationOrChassisNo?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Registration / Chassis no is required",
    };
  }

  if (!input.primaryOperator?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Primary operator is required",
    };
  }

  if (!input.initialStatus?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Initial status is required",
    };
  }

  const equipment = await createEquipment(
    {
      equipmentName: input.equipmentName.trim(),
      category: input.category.trim(),
      registrationOrChassisNo: input.registrationOrChassisNo.trim(),
      ...(input.operationalAssignment?.trim() && {
        operationalAssignment: input.operationalAssignment.trim(),
      }),
      primaryOperator: input.primaryOperator.trim(),
      initialStatus: input.initialStatus.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Equipment created successfully",
      equipment,
    },
  };
}

export async function getEquipmentsService(): Promise<
  ServiceResult<{ equipments: EquipmentModel[] }>
> {
  const equipments = await getEquipments();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { equipments },
  };
}

export async function getEquipmentByIdService(
  id: number,
): Promise<ServiceResult<{ equipment: EquipmentModel }>> {
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Equipment not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { equipment },
  };
}

export async function updateEquipmentService(
  id: number,
  input: UpdateEquipmentInput,
): Promise<ServiceResult<{ message: string; equipment: EquipmentModel }>> {
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Equipment not found",
    };
  }

  const updated = await updateEquipment(id, {
    ...(input.equipmentName?.trim() && {
      equipmentName: input.equipmentName.trim(),
    }),
    ...(input.category?.trim() && { category: input.category.trim() }),
    ...(input.registrationOrChassisNo?.trim() && {
      registrationOrChassisNo: input.registrationOrChassisNo.trim(),
    }),
    ...(input.operationalAssignment !== undefined && {
      operationalAssignment: input.operationalAssignment.trim(),
    }),
    ...(input.primaryOperator?.trim() && {
      primaryOperator: input.primaryOperator.trim(),
    }),
    ...(input.initialStatus?.trim() && {
      initialStatus: input.initialStatus.trim(),
    }),
  });

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update equipment",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Equipment updated successfully",
      equipment: updated,
    },
  };
}

export async function deleteEquipmentService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Equipment not found",
    };
  }

  const deleted = await deleteEquipment(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete equipment",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { message: "Equipment deleted successfully" },
  };
}
