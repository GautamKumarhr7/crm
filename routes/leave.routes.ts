import { Router } from "express";

import {
  createLeaveController,
  getLeavesController,
} from "../controllers/leave.controller";
import { requireAuth } from "../middleware/auth.middleware";

const leaveRouter = Router();

leaveRouter.post("/", requireAuth, createLeaveController);
leaveRouter.get("/", requireAuth, getLeavesController);

export default leaveRouter;
