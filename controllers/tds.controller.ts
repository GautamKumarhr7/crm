import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import {
  createTdsService,
  deleteTdsService,
  getTdsByIdService,
  getTdsService,
  updateTdsService,
} from "../services/tds.service";
import type { CreateTdsInput, UpdateTdsInput } from "../type";

export async function createTdsController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const result = await createTdsService(
      req.body as CreateTdsInput,
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
        message: dbError.detail ?? "TDS ID already exists",
      });
    }

    if (dbError?.code === "23503") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid vendorId",
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function getTdsController(req: Request, res: Response) {
  try {
    const result = await getTdsService();

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

export async function getTdsByIdController(req: Request, res: Response) {
  try {
    const idParam = req.params.id as string | undefined;
    const id = parseInt(idParam || "", 10);

    if (!idParam || isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid TDS ID",
      });
    }

    const result = await getTdsByIdService(id);

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

export async function updateTdsController(req: Request, res: Response) {
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
        message: "Invalid TDS ID",
      });
    }

    const result = await updateTdsService(id, req.body as UpdateTdsInput);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    const dbError = error as { code?: string; detail?: string };

    if (dbError?.code === "23505") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: dbError.detail ?? "TDS ID already exists",
      });
    }

    if (dbError?.code === "23503") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid vendorId",
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function deleteTdsController(req: Request, res: Response) {
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
        message: "Invalid TDS ID",
      });
    }

    const result = await deleteTdsService(id);

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
