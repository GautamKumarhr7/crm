import { Router } from "express";

import {
  createEmployeeController,
  getEmployeByuserIdController,
  getEmployeesController,
  updateEmployeeController,
  deleteEmployeeController,
} from "../controllers/user.controller";
import { requireEmployeeCreator } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/employee", requireEmployeeCreator, createEmployeeController);
userRouter.get("/employee", requireEmployeeCreator, getEmployeesController);
userRouter.get(
  "/employee/:userId",
  requireEmployeeCreator,
  getEmployeByuserIdController,
);
userRouter.put(
  "/employee/:userId",
  requireEmployeeCreator,
  updateEmployeeController,
);
userRouter.delete(
  "/employee/:userId",
  requireEmployeeCreator,
  deleteEmployeeController,
);

export default userRouter;
