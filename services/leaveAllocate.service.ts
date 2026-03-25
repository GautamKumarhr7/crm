import { HTTP_STATUS } from "../constant/http.constant";
import {
  createLeaveAllocation,
  getLeaveAllocations,
  getLeaveAllocationByUserId,
  updateLeaveAllocation,
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
  // Validate required fields
  if (!input.userId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId is required",
    };
  }

  if (!input.createdBy) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "createdBy (admin) is required",
    };
  }

  // Validate that at least one leave type is provided
  if (
    !input.sick &&
    !input.casual &&
    !input.annual &&
    !input.company &&
    !input.other
  ) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "At least one leave type with value is required",
    };
  }

  const leaveAllocation = await createLeaveAllocation({
    userId: input.userId,
    sick: input.sick ?? 0,
    casual: input.casual ?? 0,
    annual: input.annual ?? 0,
    company: input.company ?? 0,
    other: input.other ?? 0,
    createdBy: input.createdBy,
  });

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Leave allocation created successfully by admin",
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

export async function getLeaveAllocationByUserIdService(
  userId: number,
): Promise<ServiceResult<{ leaveAllocation: LeaveAllocationModel }>> {
  if (!userId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId is required",
    };
  }

  const leaveAllocation = await getLeaveAllocationByUserId(userId);

  if (!leaveAllocation) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "No leave allocation found for this user",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { leaveAllocation },
  };
}

export async function updateLeaveAllocationService(
  userId: number,
  input: CreateLeaveAllocationInput,
): Promise<
  ServiceResult<{ message: string; leaveAllocation: LeaveAllocationModel }>
> {
  if (!userId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId is required",
    };
  }

  if (!input.createdBy) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "createdBy (admin) is required",
    };
  }

  // Check if allocation exists
  const existingAllocation = await getLeaveAllocationByUserId(userId);
  if (!existingAllocation) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Leave allocation not found for this user",
    };
  }

  const updateData: CreateLeaveAllocationInput = {};
  if (input.sick !== undefined) updateData.sick = input.sick;
  if (input.casual !== undefined) updateData.casual = input.casual;
  if (input.annual !== undefined) updateData.annual = input.annual;
  if (input.company !== undefined) updateData.company = input.company;
  if (input.other !== undefined) updateData.other = input.other;

  const leaveAllocation = await updateLeaveAllocation(userId, updateData);

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Leave allocation updated successfully by admin",
      leaveAllocation,
    },
  };
}
