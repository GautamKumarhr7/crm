import { Router } from "express";

import {
  createLeaveController,
  getLeavesController,
  getLeavesByUserIdController,
  getLeaveByIdController,
  approveLeaveController,
  rejectLeaveController,
} from "../controllers/leave.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const leaveRouter = Router();

leaveRouter.post("/", requireAuth, createLeaveController);
leaveRouter.get("/", requireAuth, getLeavesController);
leaveRouter.get("/user/:userId", requireAuth, getLeavesByUserIdController);
leaveRouter.get("/:id", requireAuth, getLeaveByIdController);
leaveRouter.patch(
  "/:id/approve",
  requireAuth,
  requireAdmin,
  approveLeaveController,
);
leaveRouter.patch(
  "/:id/reject",
  requireAuth,
  requireAdmin,
  rejectLeaveController,
);

export default leaveRouter;
