import { Router } from "express";

import {
  createTenderController,
  getTendersController,
} from "../controllers/tender.controller";
import { requireAuth } from "../middleware/auth.middleware";

const tenderRouter = Router();

tenderRouter.post("/", requireAuth, createTenderController);
tenderRouter.get("/", requireAuth, getTendersController);

export default tenderRouter;
