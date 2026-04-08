import { HTTP_STATUS } from "../constant/http.constant";
import { isMainDepartment } from "../constant/department.constant";
import {
  canCreateEmployee,
  getRoleIdForDepartment,
} from "../constant/role.constant";
import { USER_MESSAGES } from "../constant/user.constant";
import { findUserByEmail } from "../repository/auth.repository";
import {
  getEmployeById,
  createEmployeeByAdmin,
  getEmployeByuserId,
  getEmployeesByAdmin,
} from "../repository/user.repository";
import {
  CreateEmployeeInput,
  ServiceResult,
  UserWithoutPassword,
} from "../type";
import { hashPassword } from "./auth.service";

export async function createEmployeeForAdmin(
  input: CreateEmployeeInput,
  adminId: number,
): Promise<ServiceResult<{ message: string; user: UserWithoutPassword }>> {
  const name = input.name?.trim();
  const email = input.email?.trim();
  const department = input.department?.trim();

  if (!name || !email) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: USER_MESSAGES.EMPLOYEE_NAME_EMAIL_REQUIRED,
    };
  }

  if (!isMainDepartment(department)) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: USER_MESSAGES.EMPLOYEE_DEPARTMENT_REQUIRED,
    };
  }

  const roleId = getRoleIdForDepartment(department);

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: USER_MESSAGES.EMPLOYEE_EMAIL_ALREADY_EXISTS,
    };
  }

  const rawPassword = input.password?.trim() || name;
  const hashedPassword = await hashPassword(rawPassword);
  const createdUser = await createEmployeeByAdmin(
    {
      ...input,
      name,
      email,
      department,
      roleId,
    },
    adminId,
    hashedPassword,
  );
  const { password: _password, ...userWithoutPassword } = createdUser;

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: USER_MESSAGES.EMPLOYEE_CREATED_SUCCESSFULLY,
      user: userWithoutPassword,
    },
  };
}

export async function getEmployeesForAdmin(
  adminId: number,
): Promise<ServiceResult<{ employees: UserWithoutPassword[] }>> {
  const employees = await getEmployeesByAdmin(adminId);
  const usersWithoutPasswords = employees.map(
    ({ password: _password, ...user }) => user,
  );

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { employees: usersWithoutPasswords },
  };
}

export async function getEmployeByuserIdForAdmin(
  authUserId: number,
  userId: number,
  roleId: number,
): Promise<ServiceResult<{ employee: UserWithoutPassword }>> {
  if (!userId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId is required",
    };
  }

  const canManageEmployees = canCreateEmployee(roleId);

  if (!canManageEmployees && authUserId !== userId) {
    return {
      ok: false,
      status: HTTP_STATUS.FORBIDDEN,
      message: "You can only access your own profile",
    };
  }

  const employee = canManageEmployees
    ? await getEmployeByuserId(authUserId, userId)
    : await getEmployeById(userId);

  if (!employee) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Employee not found",
    };
  }

  const { password: _password, ...userWithoutPassword } = employee;

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { employee: userWithoutPassword },
  };
}
