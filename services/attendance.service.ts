import { HTTP_STATUS } from "../constant/http.constant";
import { ATTENDANCE_MESSAGES } from "../constant/attendance.constant";
import { canCreateEmployee } from "../constant/role.constant";
import {
  createAttendanceLog,
  findAttendanceByUserAndDate,
  getAttendanceLogs,
  updateAttendanceClockIn,
  updateAttendanceClockOut,
} from "../repository/attendance.repository";
import type { AttendanceLogWithUser, ServiceResult } from "../type";

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function calculateWorkingHours(clockIn: Date, clockOut: Date) {
  const diffMs = clockOut.getTime() - clockIn.getTime();
  if (diffMs <= 0) return 0;
  return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
}

function normalizeAttendanceLog(log: AttendanceLogWithUser) {
  if (!log.clockIn || !log.clockOut || log.workingHours !== null) {
    return log;
  }

  return {
    ...log,
    workingHours: calculateWorkingHours(
      new Date(log.clockIn),
      new Date(log.clockOut),
    ),
  };
}

export async function clockInAttendanceService(
  userId: number,
): Promise<
  ServiceResult<{ message: string; attendanceLog: AttendanceLogWithUser }>
> {
  const attendanceDate = getTodayDateString();
  const now = new Date();
  const existingAttendance = await findAttendanceByUserAndDate(
    userId,
    attendanceDate,
  );

  if (existingAttendance?.clockIn && !existingAttendance.clockOut) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.ATTENDANCE_ALREADY_CLOCKED_IN,
    };
  }

  if (existingAttendance?.clockIn && existingAttendance.clockOut) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.ATTENDANCE_ALREADY_CLOCKED_OUT,
    };
  }

  const attendanceLog = existingAttendance
    ? await updateAttendanceClockIn({
        userId,
        attendanceDate,
        clockIn: now,
      })
    : await createAttendanceLog({
        userId,
        attendanceDate,
        clockIn: now,
      });

  if (!attendanceLog) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: ATTENDANCE_MESSAGES.ATTENDANCE_NOT_FOUND,
    };
  }

  const attendanceLogs = await getAttendanceLogs(userId);

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: ATTENDANCE_MESSAGES.ATTENDANCE_CLOCK_IN_SUCCESS,
      attendanceLog: normalizeAttendanceLog(
        attendanceLogs[0] ?? (attendanceLog as AttendanceLogWithUser),
      ),
    },
  };
}

export async function clockOutAttendanceService(
  userId: number,
): Promise<
  ServiceResult<{ message: string; attendanceLog: AttendanceLogWithUser }>
> {
  const attendanceDate = getTodayDateString();
  const now = new Date();
  const existingAttendance = await findAttendanceByUserAndDate(
    userId,
    attendanceDate,
  );

  if (!existingAttendance?.clockIn) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.ATTENDANCE_CLOCK_IN_BEFORE_CLOCK_OUT,
    };
  }

  if (existingAttendance.clockOut) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.ATTENDANCE_ALREADY_CLOCKED_OUT,
    };
  }

  const workingHours = calculateWorkingHours(existingAttendance.clockIn, now);
  const attendanceLog = await updateAttendanceClockOut({
    userId,
    attendanceDate,
    clockOut: now,
    workingHours,
  });

  if (!attendanceLog) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: ATTENDANCE_MESSAGES.ATTENDANCE_NOT_FOUND,
    };
  }

  const attendanceLogs = await getAttendanceLogs(userId);

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: ATTENDANCE_MESSAGES.ATTENDANCE_CLOCK_OUT_SUCCESS,
      attendanceLog: normalizeAttendanceLog(
        attendanceLogs[0] ?? (attendanceLog as AttendanceLogWithUser),
      ),
    },
  };
}

export async function getAttendanceLogsService(
  authUserId: number,
  roleId: number,
  targetUserId?: number,
): Promise<ServiceResult<{ attendanceLogs: AttendanceLogWithUser[] }>> {
  const canViewAll = canCreateEmployee(roleId);
  const effectiveUserId = targetUserId ?? (canViewAll ? undefined : authUserId);

  if (targetUserId && !canViewAll && targetUserId !== authUserId) {
    return {
      ok: false,
      status: HTTP_STATUS.FORBIDDEN,
      message: ATTENDANCE_MESSAGES.ATTENDANCE_FORBIDDEN,
    };
  }

  const attendanceLogs = await getAttendanceLogs(effectiveUserId);

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      attendanceLogs: attendanceLogs.map(normalizeAttendanceLog),
    },
  };
}
