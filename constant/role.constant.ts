import { MainDepartment } from "./department.constant";

export const ROLE_IDS = {
  ADMIN: 0,
  GENERAL_AND_ADMINISTRATION: 1,
  HR: 2,
  ACCOUNTS: 3,
  MARKETING: 4,
} as const;

export const DEPARTMENT_ROLE_ID_MAP: Record<MainDepartment, number> = {
  Admin: ROLE_IDS.ADMIN,
  "General & Administration": ROLE_IDS.GENERAL_AND_ADMINISTRATION,
  HR: ROLE_IDS.HR,
  Accounts: ROLE_IDS.ACCOUNTS,
  Marketing: ROLE_IDS.MARKETING,
};

export const ADMIN_ROLE_ID = ROLE_IDS.ADMIN;

export const VALID_ROLE_IDS = Object.values(ROLE_IDS);

export function isValidRoleId(roleId?: number): roleId is number {
  if (typeof roleId !== "number") return false;
  return (VALID_ROLE_IDS as readonly number[]).includes(roleId);
}

export function getRoleIdForDepartment(department: MainDepartment): number {
  return DEPARTMENT_ROLE_ID_MAP[department];
}
