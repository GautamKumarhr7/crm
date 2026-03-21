import { Request, Response } from "express";

import { HTTP_STATUS } from "../constant/http.constant";
import { SERVER_MESSAGES } from "../constant/server.constant";
import { loginUser, refreshAccessToken } from "../services/auth.service";
import type { LoginInput, RefreshTokenInput } from "../type";

export async function loginController(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body as LoginInput);

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

export function refreshTokenController(req: Request, res: Response) {
  const { refreshToken } = req.body as RefreshTokenInput;
  const result = refreshAccessToken(refreshToken);

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message });
  }

  return res.status(result.status).json(result.data);
}
