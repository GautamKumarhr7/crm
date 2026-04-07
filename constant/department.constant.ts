export const MAIN_DEPARTMENTS = [
  "Admin",
  "General & Administration",
  "HR",
  "Accounts",
  "Marketing",
] as const;

export type MainDepartment = (typeof MAIN_DEPARTMENTS)[number];

export function isMainDepartment(value?: string): value is MainDepartment {
  if (!value) return false;
  return MAIN_DEPARTMENTS.includes(value as MainDepartment);
}
