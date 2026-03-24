import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import { verifyAccessToken } from "../utils/jwt";

function getAuthPayload(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  return verifyAccessToken(token);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const payload = getAuthPayload(req);

  if (!payload) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
    });
  }

  req.authUser = payload;
  return next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authUser = getAuthPayload(req);

  if (!authUser) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USER_MESSAGES.INVALID_ACCESS_TOKEN,
    });
  }

  if (!authUser.isAdmin) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: USER_MESSAGES.ADMIN_ONLY_ACCESS,
    });
  }

  req.authUser = authUser;
  return next();
}
