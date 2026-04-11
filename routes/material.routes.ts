import { Router } from "express";

import {
  createMaterialController,
  getMaterialsController,
} from "../controllers/material.controller";
import { requireAuth } from "../middleware/auth.middleware";

const materialRouter = Router();

materialRouter.post("/", requireAuth, createMaterialController);
materialRouter.get("/", requireAuth, getMaterialsController);

export default materialRouter;
