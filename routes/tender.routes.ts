import { Router } from "express";

import {
  createTenderController,
  deleteTenderController,
  getTenderByIdController,
  getTendersController,
  updateTenderController,
} from "../controllers/tender.controller";
import { requireAuth } from "../middleware/auth.middleware";

const tenderRouter = Router();

tenderRouter.post("/", requireAuth, createTenderController);
tenderRouter.get("/", requireAuth, getTendersController);
tenderRouter.get("/:id", requireAuth, getTenderByIdController);
tenderRouter.put("/:id", requireAuth, updateTenderController);
tenderRouter.delete("/:id", requireAuth, deleteTenderController);

export default tenderRouter;
