import { Router } from "express";

import {
  createEmployeeController,
  getEmployeesController,
} from "../controllers/user.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/employee", requireAdmin, createEmployeeController);
userRouter.get("/employee", requireAdmin, getEmployeesController);

export default userRouter;
