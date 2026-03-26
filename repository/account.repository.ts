import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Accounts } from "../db/schema";
import type { AccountModel, CreateAccountInput } from "../type";

export async function findAccountByCode(
  code: string,
): Promise<AccountModel | null> {
  const rows = await db
    .select()
    .from(Accounts)
    .where(eq(Accounts.code, code))
    .limit(1);

  return (rows[0] as AccountModel | undefined) ?? null;
}

export async function createAccount(
  input: CreateAccountInput & {
    code: string;
    name: string;
    type: string;
    balance: number;
  },
): Promise<AccountModel> {
  const payload: typeof Accounts.$inferInsert = {
    code: input.code,
    name: input.name,
    type: input.type,
    balance: input.balance,
    parents: input.parents,
  };

  const rows = await db.insert(Accounts).values(payload).returning();
  return rows[0] as AccountModel;
}

export async function getAccounts(): Promise<AccountModel[]> {
  return db.select().from(Accounts);
}
