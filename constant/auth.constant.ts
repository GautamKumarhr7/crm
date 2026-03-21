export const BCRYPT_SALT_ROUNDS = 10;

export const AUTH_MESSAGES = {
  EMAIL_AND_PASSWORD_REQUIRED: "Email and password are required",
  INVALID_CREDENTIALS: "Invalid credentials",
  LOGIN_SUCCESSFUL: "Login successful",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_OR_EXPIRED_REFRESH_TOKEN: "Invalid or expired refresh token",
} as const;
