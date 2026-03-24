import { InferSelectModel } from "drizzle-orm";

import { Bills, LeaveAllocations, Leaves, Projects, Users } from "./db/schema";
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

export type ProjectModel = InferSelectModel<typeof Projects>;
export type BillModel = InferSelectModel<typeof Bills>;
export type LeaveModel = InferSelectModel<typeof Leaves>;
export type LeaveAllocationModel = InferSelectModel<typeof LeaveAllocations>;

export type CreateProjectInput = {
  code?: string;
  name?: string;
  client?: string;
  category?: string;
  value?: number;
  process?: string;
  status?: string;
  location?: string;
  advancement?: number;
  startDate?: string;
  endDate?: string;
  employeeId?: number;
};

export type CreateBillInput = {
  code?: string;
  description?: string;
  unit?: number;
  contractAmount?: number;
  subrate?: number;
  poQuantity?: number;
  billedQuantity?: number;
  noOfContract?: number;
  diffValue?: number;
  status?: string;
  isDeleted?: boolean;
};

export type CreateLeaveInput = {
  type?: string;
  total?: number;
};

export type CreateLeaveAllocationInput = {
  userId?: number;
  leaveId?: number;
  status?: string;
  taken?: number;
  reason?: string;
};
