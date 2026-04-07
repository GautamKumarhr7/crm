import jwt, { JwtPayload } from "jsonwebtoken";

import { JWT_ENV_KEYS, JWT_EXPIRES_IN } from "../constant/jwt.constant";

export type AuthPayload = {
  userId: number;
  email: string;
  roleId: number;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set in environment variables`);
  }
  return value;
}

const accessTokenSecret = getRequiredEnv(JWT_ENV_KEYS.ACCESS_TOKEN_SECRET);
const refreshTokenSecret = getRequiredEnv(JWT_ENV_KEYS.REFRESH_TOKEN_SECRET);

export function createAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: JWT_EXPIRES_IN.ACCESS_TOKEN,
  });
}

export function createRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: JWT_EXPIRES_IN.REFRESH_TOKEN,
  });
}

export function verifyRefreshToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, refreshTokenSecret);

    if (typeof decoded === "string") {
      return null;
    }

    const payload = decoded as JwtPayload & Partial<AuthPayload>;

    if (!payload.userId || !payload.email) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      roleId: Number(payload.roleId ?? 0),
    };
  } catch {
    return null;
  }
}

export function verifyAccessToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, accessTokenSecret);

    if (typeof decoded === "string") {
      return null;
    }

    const payload = decoded as JwtPayload & Partial<AuthPayload>;

    if (!payload.userId || !payload.email) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      roleId: Number(payload.roleId ?? 0),
    };
  } catch {
    return null;
  }
}
