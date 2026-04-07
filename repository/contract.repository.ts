import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Contracts } from "../db/schema";
import type { ContractModel, CreateContractInput } from "../type";

export async function findContractByContractId(
  contractId: string,
): Promise<ContractModel | null> {
  const rows = await db
    .select()
    .from(Contracts)
    .where(eq(Contracts.contractId, contractId))
    .limit(1);

  return (rows[0] as ContractModel | undefined) ?? null;
}

export async function createContract(
  input: CreateContractInput & {
    contractId: string;
    projectId: number;
    value: number;
    period: string;
    status: string;
  },
  createdBy: number,
): Promise<ContractModel> {
  const payload: typeof Contracts.$inferInsert = {
    contractId: input.contractId,
    projectId: input.projectId,
    value: input.value,
    period: input.period,
    status: input.status,
    createdBy,
  };

  const rows = await db.insert(Contracts).values(payload).returning();
  return rows[0] as ContractModel;
}

export async function getContracts(): Promise<ContractModel[]> {
  return db.select().from(Contracts);
}
