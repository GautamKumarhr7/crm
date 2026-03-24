import { Router } from "express";

import {
  createProjectController,
  getProjectsController,
} from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth.middleware";

const projectRouter = Router();

projectRouter.post("/", requireAuth, createProjectController);
projectRouter.get("/", requireAuth, getProjectsController);

export default projectRouter;
