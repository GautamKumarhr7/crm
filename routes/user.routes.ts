import { Router } from "express";

import {
  createEmployeeController,
  getEmployeByuserIdController,
  getEmployeesController,
} from "../controllers/user.controller";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/employee", requireAdmin, createEmployeeController);
userRouter.get("/employee", requireAdmin, getEmployeesController);
userRouter.get("/employee/:userId", requireAuth, getEmployeByuserIdController);

export default userRouter;
