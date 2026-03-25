import { HTTP_STATUS } from "../constant/http.constant";
import {
  createLeave,
  getLeaves,
  getLeavesByUserId,
  getLeaveById,
  approveLeave,
  rejectLeave,
} from "../repository/leave.repository";
import type {
  CreateLeaveInput,
  LeaveModel,
  ServiceResult,
  ApproveLeaveInput,
  RejectLeaveInput,
} from "../type";

export async function createLeaveService(
  input: CreateLeaveInput,
): Promise<ServiceResult<{ message: string; leave: LeaveModel }>> {
  // Validate required fields
  if (!input.userId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId is required",
    };
  }

  if (!input.title?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Leave title is required",
    };
  }

  if (!input.reason?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Leave reason is required",
    };
  }

  if (!input.createdBy) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "createdBy (employee applying for leave) is required",
    };
  }

  const leave = await createLeave({
    userId: input.userId,
    type: input.type?.trim() || "casual",
    title: input.title.trim(),
    reason: input.reason.trim(),
    createdBy: input.createdBy,
  });

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Leave applied successfully. Pending admin approval",
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

export async function getLeavesByUserIdService(
  userId: number,
): Promise<ServiceResult<{ leaves: LeaveModel[] }>> {
  if (!userId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "userId is required",
    };
  }

  const leaves = await getLeavesByUserId(userId);

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { leaves },
  };
}

export async function getLeaveByIdService(
  id: number,
): Promise<ServiceResult<{ leave: LeaveModel }>> {
  if (!id) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "id is required",
    };
  }

  const leave = await getLeaveById(id);

  if (!leave) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Leave not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { leave },
  };
}

export async function approveLeaveService(
  input: ApproveLeaveInput,
): Promise<ServiceResult<{ message: string; leave: LeaveModel }>> {
  if (!input.leaveId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "leaveId is required",
    };
  }

  if (!input.approvedBy) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "approvedBy (admin id) is required",
    };
  }

  const leave = await getLeaveById(input.leaveId);

  if (!leave) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Leave not found",
    };
  }

  if (leave.status !== "pending") {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: `Leave is already ${leave.status}. Cannot approve a ${leave.status} leave.`,
    };
  }

  const approvedLeave = await approveLeave(input.leaveId, input.approvedBy);

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Leave approved successfully",
      leave: approvedLeave,
    },
  };
}

export async function rejectLeaveService(
  input: RejectLeaveInput,
): Promise<ServiceResult<{ message: string; leave: LeaveModel }>> {
  if (!input.leaveId) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "leaveId is required",
    };
  }

  if (!input.approvedBy) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "approvedBy (admin id) is required",
    };
  }

  if (!input.rejectionReason?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "rejectionReason is required",
    };
  }

  const leave = await getLeaveById(input.leaveId);

  if (!leave) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Leave not found",
    };
  }

  if (leave.status !== "pending") {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: `Leave is already ${leave.status}. Cannot reject a ${leave.status} leave.`,
    };
  }

  const rejectedLeave = await rejectLeave(
    input.leaveId,
    input.approvedBy,
    input.rejectionReason.trim(),
  );

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Leave rejected successfully",
      leave: rejectedLeave,
    },
  };
}
