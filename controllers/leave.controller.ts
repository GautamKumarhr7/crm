import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import {
  createLeaveService,
  getLeavesService,
  getLeavesByUserIdService,
  getLeaveByIdService,
  approveLeaveService,
  rejectLeaveService,
} from "../services/leave.service";
import type {
  CreateLeaveInput,
  ApproveLeaveInput,
  RejectLeaveInput,
} from "../type";

export async function createLeaveController(req: Request, res: Response) {
  try {
    const userId = req.body.userId || req.authUser!.userId;
    const result = await createLeaveService({
      ...(req.body as CreateLeaveInput),
      userId,
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

export async function getLeavesController(req: Request, res: Response) {
  try {
    const result = await getLeavesService();

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

export async function getLeavesByUserIdController(req: Request, res: Response) {
  try {
    const userIdParam = req.params.userId;
    if (!userIdParam || typeof userIdParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid userId parameter" });
    }
    const userId = parseInt(userIdParam, 10);
    const result = await getLeavesByUserIdService(userId);

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

export async function getLeaveByIdController(req: Request, res: Response) {
  try {
    const idParam = req.params.id;
    if (!idParam || typeof idParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid id parameter" });
    }
    const id = parseInt(idParam, 10);
    const result = await getLeaveByIdService(id);

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

export async function approveLeaveController(req: Request, res: Response) {
  try {
    const idParam = req.params.id;
    if (!idParam || typeof idParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid id parameter" });
    }
    const leaveId = parseInt(idParam, 10);

    const result = await approveLeaveService({
      ...(req.body as ApproveLeaveInput),
      leaveId,
      approvedBy: req.authUser!.userId,
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

export async function rejectLeaveController(req: Request, res: Response) {
  try {
    const idParam = req.params.id;
    if (!idParam || typeof idParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid id parameter" });
    }
    const leaveId = parseInt(idParam, 10);

    const result = await rejectLeaveService({
      ...(req.body as RejectLeaveInput),
      leaveId,
      approvedBy: req.authUser!.userId,
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
