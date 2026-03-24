import { Router } from "express";

import {
  createSiteController,
  getSitesController,
} from "../controllers/site.controller";
import { requireAuth } from "../middleware/auth.middleware";

const siteRouter = Router();

siteRouter.post("/", requireAuth, createSiteController);
siteRouter.get("/", requireAuth, getSitesController);

export default siteRouter;
