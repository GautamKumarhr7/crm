import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import {
  createMaterialService,
  deleteMaterialService,
  getMaterialByIdService,
  getMaterialsService,
  updateMaterialService,
} from "../services/material.service";
import type { CreateMaterialInput, UpdateMaterialInput } from "../type";

export async function createMaterialController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const result = await createMaterialService(
      req.body as CreateMaterialInput,
      req.authUser.userId,
    );

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

export async function getMaterialsController(req: Request, res: Response) {
  try {
    const result = await getMaterialsService();

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

export async function getMaterialByIdController(req: Request, res: Response) {
  try {
    const idParam = req.params.id as string | undefined;
    const id = parseInt(idParam || "", 10);

    if (!idParam || isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid material ID",
      });
    }

    const result = await getMaterialByIdService(id);

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

export async function updateMaterialController(req: Request, res: Response) {
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
        message: "Invalid material ID",
      });
    }

    const result = await updateMaterialService(
      id,
      req.body as UpdateMaterialInput,
    );

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

export async function deleteMaterialController(req: Request, res: Response) {
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
        message: "Invalid material ID",
      });
    }

    const result = await deleteMaterialService(id);

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
