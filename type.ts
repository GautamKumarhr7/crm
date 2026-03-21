import { InferSelectModel } from "drizzle-orm";

import { Users } from "./db/schema";
import type { AuthPayload } from "./utils/jwt";

export type LoginInput = {
  email?: string;
  password?: string;
};

export type RefreshTokenInput = {
  refreshToken?: string;
};

export type ServiceResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; message: string };

export type UserModel = InferSelectModel<typeof Users>;
export type UserWithoutPassword = Omit<UserModel, "password">;

export type LoginSuccessData = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserWithoutPassword;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthPayload;
    }
  }
}

export type CreateEmployeeInput = {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
  designation?: string;
  dateOfJoining?: string;
  sallery?: number;
  pancardNo?: string;
  aadharNo?: string;
  pancardUrl?: string;
  aadharUrl?: string;
  pfDeduction?: boolean;
  esiDeduction?: boolean;
  uanNumber?: string;
  age?: number;
};
