import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import { CreateEmployeeInput, UpdateEmployeeInput } from "../type";
import {
  createEmployeeForAdmin,
  getEmployeByuserIdForAdmin,
  getEmployeesForAdmin,
  updateEmployeeForAdmin,
  deleteEmployeeForAdmin,
} from "../services/user.service";

export async function createEmployeeController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const result = await createEmployeeForAdmin(
      req.body as CreateEmployeeInput,
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
        message:
          dbError.detail ?? USER_MESSAGES.EMPLOYEE_UNIQUE_FIELD_ALREADY_EXISTS,
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}

export async function getEmployeesController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const result = await getEmployeesForAdmin(req.authUser.userId);

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

export async function getEmployeByuserIdController(
  req: Request,
  res: Response,
) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const userIdParam = req.params.userId;
    if (!userIdParam || typeof userIdParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid userId parameter" });
    }

    const userId = parseInt(userIdParam, 10);
    if (Number.isNaN(userId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid userId parameter" });
    }

    const result = await getEmployeByuserIdForAdmin(
      req.authUser.userId,
      userId,
      req.authUser.roleId,
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

export async function updateEmployeeController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const userIdParam = req.params.userId;
    if (!userIdParam || typeof userIdParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid userId parameter" });
    }

    const userId = parseInt(userIdParam, 10);
    if (Number.isNaN(userId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid userId parameter" });
    }

    const result = await updateEmployeeForAdmin(
      userId,
      req.body as UpdateEmployeeInput,
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

export async function deleteEmployeeController(req: Request, res: Response) {
  try {
    if (!req.authUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
      });
    }

    const userIdParam = req.params.userId;
    if (!userIdParam || typeof userIdParam !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid userId parameter" });
    }

    const userId = parseInt(userIdParam, 10);
    if (Number.isNaN(userId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Invalid userId parameter" });
    }

    const result = await deleteEmployeeForAdmin(userId);

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
