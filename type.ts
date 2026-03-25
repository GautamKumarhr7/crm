import { InferSelectModel } from "drizzle-orm";

import {
  Bills,
  LeaveAllocations,
  Leaves,
  Milestones,
  Projects,
  Sites,
  Users,
  Works,
} from "./db/schema";
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
export type SiteModel = InferSelectModel<typeof Sites>;
export type WorkModel = InferSelectModel<typeof Works>;
export type MilestoneModel = InferSelectModel<typeof Milestones>;

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
  userId?: number;
  type?: string;
  title?: string;
  reason?: string;
  createdBy?: number;
};

export type ApproveLeaveInput = {
  leaveId?: number;
  approvedBy?: number;
};

export type RejectLeaveInput = {
  leaveId?: number;
  rejectionReason?: string;
  approvedBy?: number;
};

export type CreateLeaveAllocationInput = {
  userId?: number;
  sick?: number;
  casual?: number;
  annual?: number;
  company?: number;
  other?: number;
  createdBy?: number;
};

export type CreateSiteInput = {
  projectId?: number;
  name?: string;
  location?: string;
  supervisor?: string;
  count?: number;
  budget?: number;
  complexity?: string;
  status?: string;
  rating?: number;
};

export type CreateWorkInput = {
  projectId?: number;
  contractor?: string;
  description?: string;
  value?: number;
  retention?: number;
  startDate?: string;
  target?: string;
  type?: string;
  status?: string;
};

export type CreateMilestoneInput = {
  siteId?: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;
  status?: string;
  completion?: number;
};
