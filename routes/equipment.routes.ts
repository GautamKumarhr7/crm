import { Router } from "express";

import {
  createEquipmentController,
  deleteEquipmentController,
  getEquipmentByIdController,
  getEquipmentsController,
  updateEquipmentController,
} from "../controllers/equipment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const equipmentRouter = Router();

equipmentRouter.post("/", requireAuth, createEquipmentController);
equipmentRouter.get("/", requireAuth, getEquipmentsController);
equipmentRouter.get("/:id", requireAuth, getEquipmentByIdController);
equipmentRouter.put("/:id", requireAuth, updateEquipmentController);
equipmentRouter.delete("/:id", requireAuth, deleteEquipmentController);

export default equipmentRouter;
