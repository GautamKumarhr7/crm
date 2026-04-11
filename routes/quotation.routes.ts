import { Router } from "express";

import {
  createQuotationController,
  getQuotationsController,
} from "../controllers/quotation.controller";
import { requireAuth } from "../middleware/auth.middleware";

const quotationRouter = Router();

quotationRouter.post("/", requireAuth, createQuotationController);
quotationRouter.get("/", requireAuth, getQuotationsController);

export default quotationRouter;
