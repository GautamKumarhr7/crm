import { Router } from "express";

import {
  createProcurementController,
  getProcurementsController,
} from "../controllers/procurement.controller";
import { requireAuth } from "../middleware/auth.middleware";

const procurementRouter = Router();

procurementRouter.post("/", requireAuth, createProcurementController);
procurementRouter.get("/", requireAuth, getProcurementsController);

export default procurementRouter;
