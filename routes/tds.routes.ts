import { Router } from "express";

import {
  createTdsController,
  deleteTdsController,
  getTdsByIdController,
  getTdsController,
  updateTdsController,
} from "../controllers/tds.controller";
import { requireAuth } from "../middleware/auth.middleware";

const tdsRouter = Router();

tdsRouter.post("/", requireAuth, createTdsController);
tdsRouter.get("/", requireAuth, getTdsController);
tdsRouter.get("/:id", requireAuth, getTdsByIdController);
tdsRouter.put("/:id", requireAuth, updateTdsController);
tdsRouter.delete("/:id", requireAuth, deleteTdsController);

export default tdsRouter;
