import { Router } from "express";

import {
  createLeaveAllocationController,
  getLeaveAllocationsController,
} from "../controllers/leaveAllocate.controller";
import { requireAuth } from "../middleware/auth.middleware";

const leaveAllocateRouter = Router();

leaveAllocateRouter.post("/", requireAuth, createLeaveAllocationController);
leaveAllocateRouter.get("/", requireAuth, getLeaveAllocationsController);

export default leaveAllocateRouter;
