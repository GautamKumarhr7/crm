import { HTTP_STATUS } from "../constant/http.constant";
import {
  createAccount,
  findAccountByCode,
  getAccounts,
} from "../repository/account.repository";
import type { AccountModel, CreateAccountInput, ServiceResult } from "../type";

export async function createAccountService(
  input: CreateAccountInput,
): Promise<ServiceResult<{ message: string; account: AccountModel }>> {
  if (!input.code?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Code is required",
    };
  }

  if (!input.name?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Name is required",
    };
  }

  if (!input.type?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Type is required",
    };
  }

  const code = input.code.trim();
  const existing = await findAccountByCode(code);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Account code already exists",
    };
  }

  const account = await createAccount({
    code,
    name: input.name.trim(),
    type: input.type.trim(),
    balance: input.balance ?? 0,
    ...(input.parents?.trim() ? { parents: input.parents.trim() } : {}),
  });

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Account created successfully",
      account,
    },
  };
}

export async function getAccountsService(): Promise<
  ServiceResult<{ accounts: AccountModel[] }>
> {
  const accounts = await getAccounts();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { accounts },
  };
}
