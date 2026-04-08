import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import {
  createPayrollService,
  getPayrollsByUserIdService,
  getPayrollsService,
} from "../services/payroll.service";
import type { CreatePayrollInput } from "../type";

export async function createPayrollController(req: Request, res: Response) {
  try {
    const result = await createPayrollService({
      ...(req.body as CreatePayrollInput),
      createdBy: req.authUser!.userId,
    });

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

export async function getPayrollsController(req: Request, res: Response) {
  try {
    const result = await getPayrollsService();

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

export async function getPayrollsByUserIdController(
  req: Request,
  res: Response,
) {
  try {
    const userIdParam = req.params.userId;
    if (!userIdParam || typeof userIdParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid userId parameter" });
    }

    const userId = parseInt(userIdParam, 10);
    const result = await getPayrollsByUserIdService(userId);

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
