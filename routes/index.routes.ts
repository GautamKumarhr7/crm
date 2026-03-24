import { Router } from "express";

import authRouter from "./auth.routes";
import billRouter from "./bill.routes";
import leaveAllocateRouter from "./leaveAllocate.routes";
import leaveRouter from "./leave.routes";
import projectRouter from "./project.routes";
import userRouter from "./user.routes";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/projects", projectRouter);
indexRouter.use("/bills", billRouter);
indexRouter.use("/leaves", leaveRouter);
indexRouter.use("/leave-allocations", leaveAllocateRouter);

export default indexRouter;
