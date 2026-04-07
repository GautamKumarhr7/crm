import { Router } from "express";

import {
  createVendorController,
  getVendorsController,
} from "../controllers/vendor.controller";
import { requireAuth } from "../middleware/auth.middleware";

const vendorRouter = Router();

vendorRouter.post("/", requireAuth, createVendorController);
vendorRouter.get("/", requireAuth, getVendorsController);

export default vendorRouter;
