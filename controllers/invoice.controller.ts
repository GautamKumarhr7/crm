import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import {
  createInvoiceService,
  getInvoicesByProjectIdService,
  getInvoicesService,
} from "../services/invoice.service";
import type { CreateInvoiceInput } from "../type";

export async function createInvoiceController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const result = await createInvoiceService(
      req.body as CreateInvoiceInput,
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

export async function getInvoicesController(req: Request, res: Response) {
  try {
    const result = await getInvoicesService();

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

export async function getInvoicesByProjectIdController(
  req: Request,
  res: Response,
) {
  try {
    const projectIdParam = req.params.projectId;
    if (!projectIdParam || typeof projectIdParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid projectId parameter" });
    }

    const projectId = parseInt(projectIdParam, 10);
    const result = await getInvoicesByProjectIdService(projectId);

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
