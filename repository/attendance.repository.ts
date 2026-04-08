import { and, desc, eq } from "drizzle-orm";

import { db } from "../db/connection";
import { AttendanceLogs, Users } from "../db/schema";
import type { AttendanceLogModel, AttendanceLogWithUser } from "../type";

export async function findAttendanceByUserAndDate(
  userId: number,
  attendanceDate: string,
): Promise<AttendanceLogModel | null> {
  const rows = await db
    .select()
    .from(AttendanceLogs)
    .where(
      and(
        eq(AttendanceLogs.userId, userId),
        eq(AttendanceLogs.attendanceDate, attendanceDate),
      ),
    );

  return rows[0] ?? null;
}

export async function createAttendanceLog(input: {
  userId: number;
  attendanceDate: string;
  clockIn?: Date | null;
  clockOut?: Date | null;
  workingHours?: number | null;
}): Promise<AttendanceLogModel> {
  const rows = await db.insert(AttendanceLogs).values(input).returning();

  return rows[0] as AttendanceLogModel;
}

export async function updateAttendanceClockIn(input: {
  userId: number;
  attendanceDate: string;
  clockIn: Date;
}): Promise<AttendanceLogModel | null> {
  const rows = await db
    .update(AttendanceLogs)
    .set({
      clockIn: input.clockIn,
    })
    .where(
      and(
        eq(AttendanceLogs.userId, input.userId),
        eq(AttendanceLogs.attendanceDate, input.attendanceDate),
      ),
    )
    .returning();

  return rows[0] ?? null;
}

export async function updateAttendanceClockOut(input: {
  userId: number;
  attendanceDate: string;
  clockOut: Date;
  workingHours: number;
}): Promise<AttendanceLogModel | null> {
  const rows = await db
    .update(AttendanceLogs)
    .set({
      clockOut: input.clockOut,
      workingHours: input.workingHours,
    })
    .where(
      and(
        eq(AttendanceLogs.userId, input.userId),
        eq(AttendanceLogs.attendanceDate, input.attendanceDate),
      ),
    )
    .returning();

  return rows[0] ?? null;
}

export async function getAttendanceLogs(
  userId?: number,
): Promise<AttendanceLogWithUser[]> {
  const baseQuery = db
    .select({
      id: AttendanceLogs.id,
      userId: AttendanceLogs.userId,
      attendanceDate: AttendanceLogs.attendanceDate,
      clockIn: AttendanceLogs.clockIn,
      clockOut: AttendanceLogs.clockOut,
      workingHours: AttendanceLogs.workingHours,
      createdAt: AttendanceLogs.createdAt,
      updatedAt: AttendanceLogs.updatedAt,
      user: {
        id: Users.id,
        name: Users.name,
        email: Users.email,
        department: Users.department,
        designation: Users.designation,
        roleId: Users.roleId,
        type: Users.type,
      },
    })
    .from(AttendanceLogs)
    .leftJoin(Users, eq(AttendanceLogs.userId, Users.id));

  const rows = userId
    ? await baseQuery
        .where(eq(AttendanceLogs.userId, userId))
        .orderBy(
          desc(AttendanceLogs.attendanceDate),
          desc(AttendanceLogs.clockIn),
        )
    : await baseQuery.orderBy(
        desc(AttendanceLogs.attendanceDate),
        desc(AttendanceLogs.clockIn),
      );

  return rows as AttendanceLogWithUser[];
}
