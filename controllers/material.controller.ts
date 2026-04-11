import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import {
  createMaterialService,
  getMaterialsService,
} from "../services/material.service";
import type { CreateMaterialInput } from "../type";

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
