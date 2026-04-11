import { Router } from "express";

import {
  createEquipmentController,
  getEquipmentsController,
} from "../controllers/equipment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const equipmentRouter = Router();

equipmentRouter.post("/", requireAuth, createEquipmentController);
equipmentRouter.get("/", requireAuth, getEquipmentsController);

export default equipmentRouter;
