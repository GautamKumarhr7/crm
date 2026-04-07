import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import {
  createVendorService,
  getVendorsService,
} from "../services/vendor.service";
import type { CreateVendorInput } from "../type";

export async function createVendorController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const result = await createVendorService(
      req.body as CreateVendorInput,
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
        message: dbError.detail ?? "GSTIN / PAN already exists",
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function getVendorsController(req: Request, res: Response) {
  try {
    const result = await getVendorsService();

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
