import { Router } from "express";

import {
  createMaterialReconciliationController,
  getMaterialReconciliationsController,
} from "../controllers/materialReconciliation.controller";
import { requireAuth } from "../middleware/auth.middleware";

const materialReconciliationRouter = Router();

materialReconciliationRouter.post(
  "/",
  requireAuth,
  createMaterialReconciliationController,
);
materialReconciliationRouter.get(
  "/",
  requireAuth,
  getMaterialReconciliationsController,
);

export default materialReconciliationRouter;
