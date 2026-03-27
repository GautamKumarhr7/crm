import { Router } from "express";

import accountRouter from "./accounts.routes";
import authRouter from "./auth.routes";
import billRouter from "./bill.routes";
import invoiceRouter from "./invoice.routes";
import leaveAllocateRouter from "./leaveAllocate.routes";
import leaveRouter from "./leave.routes";
import materialReconciliationRouter from "./materialReconciliation.routes";
import milestoneRouter from "./milestone.routes";
import procurementRouter from "./procurement.routes";
import projectRouter from "./project.routes";
import siteRouter from "./site.routes";
import tenderRouter from "./tender.routes";
import userRouter from "./user.routes";
import workRouter from "./work.routes";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/accounts", accountRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/projects", projectRouter);
indexRouter.use("/bills", billRouter);
indexRouter.use("/invoices", invoiceRouter);
indexRouter.use("/leaves", leaveRouter);
indexRouter.use("/leave-allocations", leaveAllocateRouter);
indexRouter.use("/procurements", procurementRouter);
indexRouter.use("/material-reconciliations", materialReconciliationRouter);
indexRouter.use("/tenders", tenderRouter);
indexRouter.use("/sites", siteRouter);
indexRouter.use("/works", workRouter);
indexRouter.use("/milestones", milestoneRouter);

export default indexRouter;
