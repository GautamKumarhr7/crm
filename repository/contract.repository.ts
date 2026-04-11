import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Contracts } from "../db/schema";
import type {
  ContractModel,
  CreateContractInput,
  UpdateContractInput,
} from "../type";

export async function getContractById(
  id: number,
): Promise<ContractModel | null> {
  const rows = await db
    .select()
    .from(Contracts)
    .where(eq(Contracts.id, id))
    .limit(1);

  return (rows[0] as ContractModel | undefined) ?? null;
}

export async function findContractByReferenceId(
  referenceId: string,
): Promise<ContractModel | null> {
  const rows = await db
    .select()
    .from(Contracts)
    .where(eq(Contracts.referenceId, referenceId))
    .limit(1);

  return (rows[0] as ContractModel | undefined) ?? null;
}

export async function createContract(
  input: CreateContractInput & {
    referenceId: string;
    projectId: number;
    contractValue: number;
    validity: string;
    status: string;
  },
  createdBy: number,
): Promise<ContractModel> {
  const payload: typeof Contracts.$inferInsert = {
    referenceId: input.referenceId,
    projectId: input.projectId,
    contractValue: input.contractValue,
    validity: input.validity,
    status: input.status,
    createdBy,
  };

  const rows = await db.insert(Contracts).values(payload).returning();
  return rows[0] as ContractModel;
}

export async function getContracts(): Promise<ContractModel[]> {
  return db.select().from(Contracts);
}

export async function updateContract(
  id: number,
  input: UpdateContractInput,
): Promise<ContractModel | null> {
  const rows = await db
    .update(Contracts)
    .set({
      ...(input.contractValue !== undefined && {
        contractValue: input.contractValue,
      }),
      ...(input.validity && { validity: input.validity }),
      ...(input.status && { status: input.status }),
    })
    .where(eq(Contracts.id, id))
    .returning();

  return (rows[0] as ContractModel | undefined) ?? null;
}

export async function deleteContract(id: number): Promise<boolean> {
  const rows = await db
    .delete(Contracts)
    .where(eq(Contracts.id, id))
    .returning();
  return rows.length > 0;
}
