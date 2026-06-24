import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { Parties } from "../db/schema";
import type { CreatePartyInput, PartyModel, UpdatePartyInput } from "../type";

export async function getPartyById(id: number): Promise<PartyModel | null> {
  const rows = await db
    .select()
    .from(Parties)
    .where(eq(Parties.id, id))
    .limit(1);

  return (rows[0] as PartyModel | undefined) ?? null;
}

export async function createParty(
  input: CreatePartyInput & { partyName: string },
  createdBy: number,
): Promise<PartyModel> {
  const payload: typeof Parties.$inferInsert = {
    partyName: input.partyName,
    address: input.address,
    state: input.state,
    city: input.city,
    pincode: input.pincode,
    gstin: input.gstin,
    createdBy,
  };

  const rows = await db.insert(Parties).values(payload).returning();
  return rows[0] as PartyModel;
}

export async function getParties(): Promise<PartyModel[]> {
  return db.select().from(Parties);
}

export async function updateParty(
  id: number,
  input: UpdatePartyInput,
): Promise<PartyModel | null> {
  const rows = await db
    .update(Parties)
    .set({
      ...(input.partyName && { partyName: input.partyName }),
      ...(input.address && { address: input.address }),
      ...(input.state && { state: input.state }),
      ...(input.city && { city: input.city }),
      ...(input.pincode && { pincode: input.pincode }),
      ...(input.gstin && { gstin: input.gstin }),
      ...(input.isDeleted !== undefined && { isDeleted: input.isDeleted }),
    })
    .where(eq(Parties.id, id))
    .returning();

  return (rows[0] as PartyModel | undefined) ?? null;
}

export async function deleteParty(id: number): Promise<boolean> {
  const rows = await db.delete(Parties).where(eq(Parties.id, id)).returning();
  return rows.length > 0;
}
