import { Router } from "express";

import {
  createPartyController,
  deletePartyController,
  getPartyByIdController,
  getPartiesController,
  updatePartyController,
} from "../controllers/party.controller";
import { requireAuth } from "../middleware/auth.middleware";

const partyRouter = Router();

partyRouter.post("/", requireAuth, createPartyController);
partyRouter.get("/", requireAuth, getPartiesController);
partyRouter.get("/:id", requireAuth, getPartyByIdController);
partyRouter.put("/:id", requireAuth, updatePartyController);
partyRouter.delete("/:id", requireAuth, deletePartyController);

export default partyRouter;
