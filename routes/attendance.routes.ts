import { Router } from "express";

import {
  clockInAttendanceController,
  clockOutAttendanceController,
  getAttendanceLogsByUserController,
  getAttendanceLogsController,
  getMyAttendanceLogsController,
} from "../controllers/attendance.controller";
import {
  requireAuth,
  requireEmployeeCreator,
} from "../middleware/auth.middleware";

const attendanceRouter = Router();

attendanceRouter.post("/clock-in", requireAuth, clockInAttendanceController);
attendanceRouter.post("/clock-out", requireAuth, clockOutAttendanceController);
attendanceRouter.get("/", requireEmployeeCreator, getAttendanceLogsController);
attendanceRouter.get("/me", requireAuth, getMyAttendanceLogsController);
attendanceRouter.get(
  "/:userId",
  requireAuth,
  getAttendanceLogsByUserController,
);

export default attendanceRouter;
