import { Router } from "express";

import {
  createMilestoneController,
  getMilestonesController,
} from "../controllers/milestone.controller";
import { requireAuth } from "../middleware/auth.middleware";

const milestoneRouter = Router();

milestoneRouter.post("/", requireAuth, createMilestoneController);
milestoneRouter.get("/", requireAuth, getMilestonesController);

export default milestoneRouter;
