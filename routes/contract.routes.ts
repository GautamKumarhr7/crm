import { Router } from "express";

import {
  createContractController,
  deleteContractController,
  getContractByIdController,
  getContractsController,
  updateContractController,
} from "../controllers/contract.controller";
import { requireAuth } from "../middleware/auth.middleware";

const contractRouter = Router();

contractRouter.post("/", requireAuth, createContractController);
contractRouter.get("/", requireAuth, getContractsController);
contractRouter.get("/:id", requireAuth, getContractByIdController);
contractRouter.put("/:id", requireAuth, updateContractController);
contractRouter.delete("/:id", requireAuth, deleteContractController);

export default contractRouter;
