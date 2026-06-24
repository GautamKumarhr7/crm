import { HTTP_STATUS } from "../constant/http.constant";
import {
  createParty,
  deleteParty,
  getPartyById,
  getParties,
  updateParty,
} from "../repository/party.repository";
import type {
  CreatePartyInput,
  PartyModel,
  ServiceResult,
  UpdatePartyInput,
} from "../type";

export async function createPartyService(
  input: CreatePartyInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; party: PartyModel }>> {
  if (!input.partyName?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "partyName is required",
    };
  }

  const party = await createParty(
    {
      partyName: input.partyName.trim(),
      address: input.address,
      state: input.state,
      city: input.city,
      pincode: input.pincode,
      gstin: input.gstin,
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: { message: "Party created successfully", party },
  };
}

export async function getPartiesService(): Promise<
  ServiceResult<{ parties: PartyModel[] }>
> {
  const parties = await getParties();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { parties },
  };
}

export async function getPartyByIdService(
  id: number,
): Promise<ServiceResult<{ party: PartyModel }>> {
  const party = await getPartyById(id);

  if (!party) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Party not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { party },
  };
}

export async function updatePartyService(
  id: number,
  input: UpdatePartyInput,
): Promise<ServiceResult<{ message: string; party: PartyModel }>> {
  const party = await getPartyById(id);

  if (!party) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Party not found",
    };
  }

  const updated = await updateParty(id, input);

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update party",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { message: "Party updated successfully", party: updated },
  };
}

export async function deletePartyService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const party = await getPartyById(id);

  if (!party) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Party not found",
    };
  }

  const deleted = await deleteParty(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete party",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { message: "Party deleted successfully" },
  };
}
