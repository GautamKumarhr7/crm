import { Router } from "express";

import {
  createAccountController,
  getAccountsController,
} from "../controllers/account.controller";
import { requireAuth } from "../middleware/auth.middleware";

const accountRouter = Router();

accountRouter.post("/", requireAuth, createAccountController);
accountRouter.get("/", requireAuth, getAccountsController);

export default accountRouter;
