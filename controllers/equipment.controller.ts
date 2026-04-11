import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import {
  createEquipmentService,
  deleteEquipmentService,
  getEquipmentByIdService,
  getEquipmentsService,
  updateEquipmentService,
} from "../services/equipment.service";
import type { CreateEquipmentInput, UpdateEquipmentInput } from "../type";

export async function createEquipmentController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const result = await createEquipmentService(
      req.body as CreateEquipmentInput,
      req.authUser.userId,
    );

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    const dbError = error as { code?: string; detail?: string };

    if (dbError?.code === "23505") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message:
          dbError.detail ?? "Registration / Chassis number already exists",
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function getEquipmentsController(req: Request, res: Response) {
  try {
    const result = await getEquipmentsService();

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function getEquipmentByIdController(req: Request, res: Response) {
  try {
    const idParam = req.params.id as string | undefined;
    const id = parseInt(idParam || "", 10);

    if (!idParam || isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid equipment ID",
      });
    }

    const result = await getEquipmentByIdService(id);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function updateEquipmentController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const idParam = req.params.id as string | undefined;
    const id = parseInt(idParam || "", 10);

    if (!idParam || isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid equipment ID",
      });
    }

    const result = await updateEquipmentService(
      id,
      req.body as UpdateEquipmentInput,
    );

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    const dbError = error as { code?: string; detail?: string };

    if (dbError?.code === "23505") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message:
          dbError.detail ?? "Registration / Chassis number already exists",
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function deleteEquipmentController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const idParam = req.params.id as string | undefined;
    const id = parseInt(idParam || "", 10);

    if (!idParam || isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid equipment ID",
      });
    }

    const result = await deleteEquipmentService(id);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}
