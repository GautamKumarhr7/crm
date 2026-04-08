import { InferSelectModel } from "drizzle-orm";

import {
  Accounts,
  Bills,
  AttendanceLogs,
  Contracts,
  Invoices,
  LeaveAllocations,
  Leaves,
  Payrolls,
  MaterialReconciliations,
  Milestones,
  Procurements,
  Projects,
  Sites,
  Tenders,
  Users,
  Vendors,
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
export type AttendanceLogModel = InferSelectModel<typeof AttendanceLogs>;

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
  roleId?: number;
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

export type UpdateEmployeeInput = {
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
export type AccountModel = InferSelectModel<typeof Accounts>;
export type BillModel = InferSelectModel<typeof Bills>;
export type InvoiceModel = InferSelectModel<typeof Invoices>;
export type ProcurementModel = InferSelectModel<typeof Procurements>;
export type TenderModel = InferSelectModel<typeof Tenders>;
export type VendorModel = InferSelectModel<typeof Vendors>;
export type ContractModel = InferSelectModel<typeof Contracts>;
export type MaterialReconciliationModel = InferSelectModel<
  typeof MaterialReconciliations
>;
export type LeaveModel = InferSelectModel<typeof Leaves>;
export type LeaveAllocationModel = InferSelectModel<typeof LeaveAllocations>;
export type PayrollModel = InferSelectModel<typeof Payrolls>;
export type SiteModel = InferSelectModel<typeof Sites>;
export type WorkModel = InferSelectModel<typeof Works>;
export type MilestoneModel = InferSelectModel<typeof Milestones>;

export type AttendanceLogWithUser = AttendanceLogModel & {
  user: Pick<
    UserModel,
    "id" | "name" | "email" | "department" | "designation" | "roleId" | "type"
  > | null;
};

export type CreateAttendanceLogInput = {
  userId?: number;
  attendanceDate?: string;
};

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

export type CreateAccountInput = {
  code?: string;
  name?: string;
  type?: string;
  balance?: number;
  parents?: string;
};

export type CreateInvoiceInput = {
  invoiceId?: string;
  projectId?: number;
  clientOrProject?: string;
  type?: string;
  date?: string;
  gst?: number;
  retention?: number;
  amount?: number;
  status?: string;
};

export type CreateProcurementInput = {
  poNumber?: string;
  vendor?: string;
  items?: string;
  amount?: number;
  raised?: string;
  expectedDelivery?: string;
  progress?: string;
  status?: string;
};

export type CreateTenderInput = {
  nameOfWork?: string;
  natureOfWorkBriefDescription?: string;
  clientNameAddress?: string;
  contractNo?: string;
  value?: number;
  date?: string;
};

export type CreateMaterialReconciliationInput = {
  billCode?: string;
  description?: string;
  unit?: string;
  contRate?: number;
  subRate?: number;
  poQty?: number;
  billedQty?: number;
  contTotal?: number;
  diffQty?: number;
  diffValue?: number;
  status?: string;
};

export type CreateVendorInput = {
  name?: string;
  category?: string;
  city?: string;
  complianceTax?: string;
  gstinOrPan?: string;
  status?: string;
};

export type CreateContractInput = {
  contractId?: string;
  projectId?: number;
  value?: number;
  period?: string;
  status?: string;
};

export type CreateLeaveInput = {
  userId?: number;
  type?: string;
  title?: string;
  reason?: string;
  days?: number;
  from?: string;
  to?: string;
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

export type CreatePayrollInput = {
  userId?: number;
  basicPay?: number;
  hra?: number;
  conveyance?: number;
  specialBonus?: number;
  pfContribution?: number;
  esi?: number;
  tdsTax?: number;
  createdBy?: number;
};

export type PayrollWithUser = PayrollModel & {
  user: Pick<
    UserModel,
    "id" | "name" | "email" | "department" | "designation" | "sallery"
  > | null;
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
