import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import {
  createContractService,
  getContractsService,
} from "../services/contract.service";
import type { CreateContractInput } from "../type";

export async function createContractController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const result = await createContractService(
      req.body as CreateContractInput,
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
        message: dbError.detail ?? "contractId already exists",
      });
    }

    if (dbError?.code === "23503") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid projectId",
      });
    }

    if (dbError?.code === "42P01") {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Contracts table is missing. Run database migrations.",
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function getContractsController(req: Request, res: Response) {
  try {
    const result = await getContractsService();

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
