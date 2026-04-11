import { Router } from "express";

import {
  createVendorController,
  deleteVendorController,
  getVendorByIdController,
  getVendorsController,
  updateVendorController,
} from "../controllers/vendor.controller";
import { requireAuth } from "../middleware/auth.middleware";

const vendorRouter = Router();

vendorRouter.post("/", requireAuth, createVendorController);
vendorRouter.get("/", requireAuth, getVendorsController);
vendorRouter.get("/:id", requireAuth, getVendorByIdController);
vendorRouter.put("/:id", requireAuth, updateVendorController);
vendorRouter.delete("/:id", requireAuth, deleteVendorController);

export default vendorRouter;
