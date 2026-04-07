import bcrypt from "bcrypt";

import { AUTH_MESSAGES, BCRYPT_SALT_ROUNDS } from "../constant/auth.constant";
import { HTTP_STATUS } from "../constant/http.constant";
import { findUserByEmail } from "../repository/auth.repository";
import type {
  LoginInput,
  LoginSuccessData,
  ServiceResult,
  UserWithoutPassword,
} from "../type";
import {
  AuthPayload,
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function loginUser(
  input: LoginInput,
): Promise<ServiceResult<LoginSuccessData>> {
  const { email, password } = input;

  if (!email || !password) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: AUTH_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED,
    };
  }

  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    return {
      ok: false,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: AUTH_MESSAGES.INVALID_CREDENTIALS,
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return {
      ok: false,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: AUTH_MESSAGES.INVALID_CREDENTIALS,
    };
  }

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email ?? "",
    roleId: Number(user.roleId ?? 0),
  };

  const { password: _password, ...userWithoutPassword } = user;

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: AUTH_MESSAGES.LOGIN_SUCCESSFUL,
      accessToken: createAccessToken(payload),
      refreshToken: createRefreshToken(payload),
      user: userWithoutPassword,
    },
  };
}

export function refreshAccessToken(
  refreshToken?: string,
): ServiceResult<{ accessToken: string }> {
  if (!refreshToken) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED,
    };
  }

  const payload = verifyRefreshToken(refreshToken);

  if (!payload) {
    return {
      ok: false,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: AUTH_MESSAGES.INVALID_OR_EXPIRED_REFRESH_TOKEN,
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { accessToken: createAccessToken(payload) },
  };
}
