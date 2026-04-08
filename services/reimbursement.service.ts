import { HTTP_STATUS } from "../constant/http.constant";
import {
  createReimbursement,
  getReimbursements,
  getReimbursementsByUserId,
  getReimbursementById,
  updateReimbursement,
  deleteReimbursement,
  approveReimbursement,
  rejectReimbursement,
} from "../repository/reimbursement.repository";
import type {
  CreateReimbursementInput,
  UpdateReimbursementInput,
  ReimbursementModel,
  ServiceResult,
  ApproveReimbursementInput,
  RejectReimbursementInput,
} from "../type";

export async function createReimbursementService(
  input: CreateReimbursementInput,
): Promise<ServiceResult<{ message: string; reimbursement: ReimbursementModel }>> {
  if (!input.userId || !input.category || !input.expenseDate || !input.amount || !input.description || !input.createdBy) {
    return { ok: false, status: HTTP_STATUS.BAD_REQUEST, message: "Missing required fields" };
  }

  const payload: Parameters<typeof createReimbursement>[0] = {
    userId: input.userId,
    category: input.category,
    expenseDate: input.expenseDate,
    amount: input.amount,
    description: input.description,
    createdBy: input.createdBy,
  };

  const reimbursement = await createReimbursement(payload);

  return { ok: true, status: HTTP_STATUS.CREATED, data: { message: "Reimbursement applied successfully", reimbursement } };
}

export async function getReimbursementsService(): Promise<ServiceResult<{ reimbursements: ReimbursementModel[] }>> {
  const reimbursements = await getReimbursements();
  return { ok: true, status: HTTP_STATUS.OK, data: { reimbursements } };
}

export async function getReimbursementsByUserIdService(userId: number): Promise<ServiceResult<{ reimbursements: ReimbursementModel[] }>> {
  const reimbursements = await getReimbursementsByUserId(userId);
  return { ok: true, status: HTTP_STATUS.OK, data: { reimbursements } };
}

export async function getReimbursementByIdService(id: number): Promise<ServiceResult<{ reimbursement: ReimbursementModel }>> {
  const reimbursement = await getReimbursementById(id);
  if (!reimbursement) return { ok: false, status: HTTP_STATUS.NOT_FOUND, message: "Reimbursement not found" };
  return { ok: true, status: HTTP_STATUS.OK, data: { reimbursement } };
}

export async function updateReimbursementService(
  id: number,
  input: UpdateReimbursementInput,
): Promise<ServiceResult<{ message: string; reimbursement: ReimbursementModel }>> {
  const reimbursement = await getReimbursementById(id);
  if (!reimbursement) return { ok: false, status: HTTP_STATUS.NOT_FOUND, message: "Reimbursement not found" };
  
  if (reimbursement.status !== "pending") return { ok: false, status: HTTP_STATUS.BAD_REQUEST, message: "Only pending reimbursements can be updated" };

  const updatedReimbursement = await updateReimbursement(id, input);
  if (!updatedReimbursement) return { ok: false, status: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: "Failed to update" };

  return { ok: true, status: HTTP_STATUS.OK, data: { message: "Reimbursement updated successfully", reimbursement: updatedReimbursement } };
}

export async function deleteReimbursementService(id: number): Promise<ServiceResult<{ message: string }>> {
  const reimbursement = await getReimbursementById(id);
  if (!reimbursement) return { ok: false, status: HTTP_STATUS.NOT_FOUND, message: "Reimbursement not found" };

  if (reimbursement.status !== "pending") return { ok: false, status: HTTP_STATUS.BAD_REQUEST, message: "Only pending reimbursements can be deleted" };

  const deleted = await deleteReimbursement(id);
  if (!deleted) return { ok: false, status: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: "Failed to delete" };

  return { ok: true, status: HTTP_STATUS.OK, data: { message: "Reimbursement deleted successfully" } };
}

export async function approveReimbursementService(
  input: ApproveReimbursementInput,
): Promise<ServiceResult<{ message: string; reimbursement: ReimbursementModel }>> {
  const reimbursement = await getReimbursementById(input.reimbursementId!);
  if (!reimbursement) return { ok: false, status: HTTP_STATUS.NOT_FOUND, message: "Reimbursement not found" };
  
  if (reimbursement.status !== "pending") return { ok: false, status: HTTP_STATUS.BAD_REQUEST, message: `Reimbursement is already ${reimbursement.status}` };

  const approved = await approveReimbursement(input.reimbursementId!, input.approvedBy!);
  return { ok: true, status: HTTP_STATUS.OK, data: { message: "Reimbursement approved", reimbursement: approved } };
}

export async function rejectReimbursementService(
  input: RejectReimbursementInput,
): Promise<ServiceResult<{ message: string; reimbursement: ReimbursementModel }>> {
  const reimbursement = await getReimbursementById(input.reimbursementId!);
  if (!reimbursement) return { ok: false, status: HTTP_STATUS.NOT_FOUND, message: "Reimbursement not found" };
  
  if (reimbursement.status !== "pending") return { ok: false, status: HTTP_STATUS.BAD_REQUEST, message: `Reimbursement is already ${reimbursement.status}` };

  const rejected = await rejectReimbursement(input.reimbursementId!, input.approvedBy!, input.rejectionReason!);
  return { ok: true, status: HTTP_STATUS.OK, data: { message: "Reimbursement rejected", reimbursement: rejected } };
}
