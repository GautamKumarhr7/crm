import { Router } from "express";

import {
  createInvoiceController,
  getInvoicesByProjectIdController,
  getInvoicesController,
} from "../controllers/invoice.controller";
import { requireAuth } from "../middleware/auth.middleware";

const invoiceRouter = Router();

invoiceRouter.post("/", requireAuth, createInvoiceController);
invoiceRouter.get("/", requireAuth, getInvoicesController);
invoiceRouter.get(
  "/project/:projectId",
  requireAuth,
  getInvoicesByProjectIdController,
);

export default invoiceRouter;
