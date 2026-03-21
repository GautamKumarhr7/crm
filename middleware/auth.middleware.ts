import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import { verifyAccessToken } from "../utils/jwt";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USER_MESSAGES.ADMIN_TOKEN_REQUIRED,
    });
  }

  const token = authHeader.slice(7).trim();
  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
    });
  }

  if (!payload.isAdmin) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: USER_MESSAGES.ADMIN_ONLY_ACCESS,
    });
  }

  req.authUser = payload;
  return next();
}
