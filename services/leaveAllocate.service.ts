import { HTTP_STATUS } from "../constant/http.constant";
import {
  createLeaveAllocation,
  getLeaveAllocations,
} from "../repository/leaveAllocate.repository";
import type {
  CreateLeaveAllocationInput,
  LeaveAllocationModel,
  ServiceResult,
} from "../type";

export async function createLeaveAllocationService(
  input: CreateLeaveAllocationInput,
): Promise<
  ServiceResult<{ message: string; leaveAllocation: LeaveAllocationModel }>
> {
  if (!input.userId || !input.leaveId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId and leaveId are required",
    };
  }

  const leaveAllocation = await createLeaveAllocation(input);

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Leave allocation created successfully",
      leaveAllocation,
    },
  };
}

export async function getLeaveAllocationsService(): Promise<
  ServiceResult<{ leaveAllocations: LeaveAllocationModel[] }>
> {
  const leaveAllocations = await getLeaveAllocations();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { leaveAllocations },
  };
}
