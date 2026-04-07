import { Router } from "express";

import {
  createContractController,
  getContractsController,
} from "../controllers/contract.controller";
import { requireAuth } from "../middleware/auth.middleware";

const contractRouter = Router();

contractRouter.post("/", requireAuth, createContractController);
contractRouter.get("/", requireAuth, getContractsController);

export default contractRouter;
