import { Router } from "express";

import {
  createVoucherController,
  deleteVoucherController,
  getVoucherByIdController,
  getVouchersController,
  updateVoucherController,
} from "../controllers/voucher.controller";
import { requireAuth } from "../middleware/auth.middleware";

const voucherRouter = Router();

voucherRouter.post("/", requireAuth, createVoucherController);
voucherRouter.get("/", requireAuth, getVouchersController);
voucherRouter.get("/:id", requireAuth, getVoucherByIdController);
voucherRouter.put("/:id", requireAuth, updateVoucherController);
voucherRouter.delete("/:id", requireAuth, deleteVoucherController);

export default voucherRouter;
