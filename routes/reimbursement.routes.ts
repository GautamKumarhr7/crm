import { Router } from "express";
import {
  createReimbursementController,
  getReimbursementsController,
  getReimbursementByIdController,
  getReimbursementsByUserIdController,
  updateReimbursementController,
  deleteReimbursementController,
  approveReimbursementController,
  rejectReimbursementController,
} from "../controllers/reimbursement.controller";
import { requireAuth, requireEmployeeCreator } from "../middleware/auth.middleware";

const reimbursementRouter = Router();

reimbursementRouter.post("/", requireAuth, createReimbursementController);
reimbursementRouter.get("/", requireAuth, getReimbursementsController);
reimbursementRouter.get("/:id", requireAuth, getReimbursementByIdController);
reimbursementRouter.get("/user/:userId", requireAuth, getReimbursementsByUserIdController);
reimbursementRouter.put("/:id", requireAuth, updateReimbursementController);
reimbursementRouter.delete("/:id", requireAuth, deleteReimbursementController);
reimbursementRouter.patch("/:id/approve", requireAuth, requireEmployeeCreator, approveReimbursementController);
reimbursementRouter.patch("/:id/reject", requireAuth, requireEmployeeCreator, rejectReimbursementController);

export default reimbursementRouter;
