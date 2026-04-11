import { Router } from "express";

import {
  createMaterialController,
  deleteMaterialController,
  getMaterialByIdController,
  getMaterialsController,
  updateMaterialController,
} from "../controllers/material.controller";
import { requireAuth } from "../middleware/auth.middleware";

const materialRouter = Router();

materialRouter.post("/", requireAuth, createMaterialController);
materialRouter.get("/", requireAuth, getMaterialsController);
materialRouter.get("/:id", requireAuth, getMaterialByIdController);
materialRouter.put("/:id", requireAuth, updateMaterialController);
materialRouter.delete("/:id", requireAuth, deleteMaterialController);

export default materialRouter;
