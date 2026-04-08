import { Router } from "express";

import {
  createPayrollController,
  getPayrollsByUserIdController,
  getPayrollsController,
} from "../controllers/payroll.controller";
import {
  requireAuth,
  requireEmployeeCreator,
} from "../middleware/auth.middleware";

const payrollRouter = Router();

payrollRouter.post(
  "/",
  requireAuth,
  requireEmployeeCreator,
  createPayrollController,
);
payrollRouter.get("/", requireAuth, getPayrollsController);
payrollRouter.get("/user/:userId", requireAuth, getPayrollsByUserIdController);

export default payrollRouter;
