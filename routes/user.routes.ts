import { Router } from "express";

import {
  createEmployeeController,
  getEmployeByuserIdController,
  getEmployeesController,
} from "../controllers/user.controller";
import {
  requireAdmin,
  requireAuth,
  requireEmployeeCreator,
} from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/employee", requireEmployeeCreator, createEmployeeController);
userRouter.get("/employee", requireAdmin, getEmployeesController);
userRouter.get("/employee/:userId", requireAuth, getEmployeByuserIdController);

export default userRouter;
