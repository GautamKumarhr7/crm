import { HTTP_STATUS } from "../constant/http.constant";
import {
  createEquipment,
  getEquipments,
} from "../repository/equipment.repository";
import type {
  CreateEquipmentInput,
  EquipmentModel,
  ServiceResult,
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
