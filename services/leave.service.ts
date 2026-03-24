import { HTTP_STATUS } from "../constant/http.constant";
import { createLeave, getLeaves } from "../repository/leave.repository";
import type { CreateLeaveInput, LeaveModel, ServiceResult } from "../type";

export async function createLeaveService(
  input: CreateLeaveInput,
): Promise<ServiceResult<{ message: string; leave: LeaveModel }>> {
  if (!input.type?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Leave type is required",
    };
  }

  if (input.total === undefined || input.total === null) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Leave total is required",
    };
  }

  const leave = await createLeave({
    type: input.type.trim(),
    total: input.total,
  });

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Leave created successfully",
      leave,
    },
  };
}

export async function getLeavesService(): Promise<
  ServiceResult<{ leaves: LeaveModel[] }>
> {
  const leaves = await getLeaves();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { leaves },
  };
}
