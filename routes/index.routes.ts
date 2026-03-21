import { Router } from "express";

import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);

export default indexRouter;
