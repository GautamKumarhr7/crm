import { Router } from "express";

import { createEmployeeController } from "../controllers/user.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/employee", requireAdmin, createEmployeeController);

export default userRouter;
