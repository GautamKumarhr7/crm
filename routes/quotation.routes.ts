import { Router } from "express";

import {
  createQuotationController,
  deleteQuotationController,
  getQuotationByIdController,
  getQuotationsController,
  updateQuotationController,
} from "../controllers/quotation.controller";
import { requireAuth } from "../middleware/auth.middleware";

const quotationRouter = Router();

quotationRouter.post("/", requireAuth, createQuotationController);
quotationRouter.get("/", requireAuth, getQuotationsController);
quotationRouter.get("/:id", requireAuth, getQuotationByIdController);
quotationRouter.put("/:id", requireAuth, updateQuotationController);
quotationRouter.delete("/:id", requireAuth, deleteQuotationController);

export default quotationRouter;
