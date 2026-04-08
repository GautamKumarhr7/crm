import { Request, Response } from "express";
import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import {
  createReimbursementService,
  getReimbursementsService,
  getReimbursementsByUserIdService,
  getReimbursementByIdService,
  updateReimbursementService,
  deleteReimbursementService,
  approveReimbursementService,
  rejectReimbursementService,
} from "../services/reimbursement.service";
import type { CreateReimbursementInput, UpdateReimbursementInput, ApproveReimbursementInput, RejectReimbursementInput } from "../type";

export async function createReimbursementController(req: Request, res: Response) {
  try {
    const result = await createReimbursementService({
      ...(req.body as CreateReimbursementInput),
      userId: req.authUser!.userId,
      createdBy: req.authUser!.userId,
    });
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR, error });
  }
}

export async function getReimbursementsController(req: Request, res: Response) {
  try {
    const result = await getReimbursementsService();
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR, error });
  }
}

export async function getReimbursementByIdController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const result = await getReimbursementByIdService(parseInt(id, 10));
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR, error });
  }
}

export async function getReimbursementsByUserIdController(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;
    const result = await getReimbursementsByUserIdService(parseInt(userId, 10));
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR, error });
  }
}

export async function updateReimbursementController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const result = await updateReimbursementService(parseInt(id, 10), req.body as UpdateReimbursementInput);
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR, error });
  }
}

export async function deleteReimbursementController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const result = await deleteReimbursementService(parseInt(id, 10));
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR, error });
  }
}

export async function approveReimbursementController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const result = await approveReimbursementService({
      ...(req.body as ApproveReimbursementInput),
      reimbursementId: parseInt(id, 10),
      approvedBy: req.authUser!.userId,
    });
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR, error });
  }
}

export async function rejectReimbursementController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const result = await rejectReimbursementService({
      ...(req.body as RejectReimbursementInput),
      reimbursementId: parseInt(id, 10),
      approvedBy: req.authUser!.userId,
    });
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR, error });
  }
}
