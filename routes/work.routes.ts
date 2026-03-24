import { Router } from "express";

import {
  createWorkController,
  getWorksController,
} from "../controllers/work.controller";
import { requireAuth } from "../middleware/auth.middleware";

const workRouter = Router();

workRouter.post("/", requireAuth, createWorkController);
workRouter.get("/", requireAuth, getWorksController);

export default workRouter;
