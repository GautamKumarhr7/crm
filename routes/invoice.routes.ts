import { Router } from "express";

import {
  createInvoiceController,
  deleteInvoiceController,
  getInvoiceByIdController,
  getInvoicesByProjectIdController,
  getInvoicesController,
  updateInvoiceController,
} from "../controllers/invoice.controller";
import { requireAuth } from "../middleware/auth.middleware";

const invoiceRouter = Router();

invoiceRouter.post("/", requireAuth, createInvoiceController);
invoiceRouter.get("/", requireAuth, getInvoicesController);
invoiceRouter.get("/:id", requireAuth, getInvoiceByIdController);
invoiceRouter.put("/:id", requireAuth, updateInvoiceController);
invoiceRouter.delete("/:id", requireAuth, deleteInvoiceController);
invoiceRouter.get(
  "/project/:projectId",
  requireAuth,
  getInvoicesByProjectIdController,
);

export default invoiceRouter;
