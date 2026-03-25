import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import {
  createLeaveAllocationService,
  getLeaveAllocationsService,
  getLeaveAllocationByUserIdService,
  updateLeaveAllocationService,
} from "../services/leaveAllocate.service";
import type { CreateLeaveAllocationInput } from "../type";

export async function createLeaveAllocationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await createLeaveAllocationService({
      ...(req.body as CreateLeaveAllocationInput),
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

export async function getLeaveAllocationsController(
  req: Request,
  res: Response,
) {
  try {
    const result = await getLeaveAllocationsService();

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

export async function getLeaveAllocationByUserIdController(
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
    const result = await getLeaveAllocationByUserIdService(userId);

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

export async function updateLeaveAllocationController(
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
    const result = await updateLeaveAllocationService(userId, {
      ...(req.body as CreateLeaveAllocationInput),
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
