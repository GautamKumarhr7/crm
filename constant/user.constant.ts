export const USER_MESSAGES = {
  ADMIN_TOKEN_REQUIRED: "Authorization token is required",
  INVALID_ACCESS_TOKEN: "Invalid or expired access token",
  ADMIN_ONLY_ACCESS: "Only admin can create employee",
  EMPLOYEE_NAME_EMAIL_REQUIRED: "Name and email are required",
  EMPLOYEE_EMAIL_ALREADY_EXISTS: "Employee email already exists",
  EMPLOYEE_UNIQUE_FIELD_ALREADY_EXISTS:
    "Employee data already exists (unique field conflict)",
  EMPLOYEE_CREATED_SUCCESSFULLY: "Employee created successfully",
} as const;
