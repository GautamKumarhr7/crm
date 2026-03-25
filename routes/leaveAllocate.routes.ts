import { Router } from "express";

import {
  createLeaveAllocationController,
  getLeaveAllocationsController,
  getLeaveAllocationByUserIdController,
  updateLeaveAllocationController,
} from "../controllers/leaveAllocate.controller";
import { requireAuth } from "../middleware/auth.middleware";

const leaveAllocateRouter = Router();

leaveAllocateRouter.post("/", requireAuth, createLeaveAllocationController);
leaveAllocateRouter.get("/", requireAuth, getLeaveAllocationsController);
leaveAllocateRouter.get(
  "/user/:userId",
  requireAuth,
  getLeaveAllocationByUserIdController,
);
leaveAllocateRouter.patch(
  "/user/:userId",
  requireAuth,
  updateLeaveAllocationController,
);

export default leaveAllocateRouter;
