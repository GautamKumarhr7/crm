import { Router } from "express";

import {
  createBillController,
  getBillsController,
} from "../controllers/bill.controller";
import { requireAuth } from "../middleware/auth.middleware";

const billRouter = Router();

billRouter.post("/", requireAuth, createBillController);
billRouter.get("/", requireAuth, getBillsController);

export default billRouter;
