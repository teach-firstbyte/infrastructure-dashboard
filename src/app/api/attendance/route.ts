import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AttendanceStatus } from "@prisma/client";

/**
 * Gets all attendance records
 * @returns the attendance records
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const meetingIdParam = searchParams.get("meetingId");
    const userIdParam = searchParams.get("userId");
    
    const where: { meetingId?: number; userId?: number } = {};

    if (meetingIdParam != null) {
      const meetingId = parseInt(meetingIdParam);
      if (isNaN(meetingId)) {
        return NextResponse.json({ error: "meetingId must be a valid integer" }, { status: 400 });
      }
      where.meetingId = meetingId;
    }

    if (userIdParam !== null) {
      const userId = parseInt(userIdParam);
      if (isNaN(userId)) {
        return NextResponse.json({ error: "userId must be a valid integer"}, { status: 400 });
      }
      where.userId = userId;
    }
    
    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        user: true,
        meeting: true
      }
    });
    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get attendance' }, { status: 500 });
  }
}

/**
 * Records attendance for a user at a meeting
 * @param request - The request object
 * @returns The created attendance record
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId, meetingId, status, checkedInAt, checkedOutAt, notes } =
      await request.json();

    // userId, meetingId, and status are required
    if (!userId || !meetingId || !status) {
      return NextResponse.json(
        { error: 'userId, meetingId, and status are required' },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId);
    const parsedMeetingId = parseInt(meetingId);
    if (isNaN(parsedUserId) || isNaN(parsedMeetingId)) {
      return NextResponse.json(
        { error: 'userId and meetingId must be valid integers' },
        { status: 400 }
      );
    }

    // Validate status using the Prisma enum
    const validStatuses = Object.values(AttendanceStatus);
    if (!validStatuses.includes(status as AttendanceStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // A user can only have one attendance record per meeting (@@unique)
    const existing = await prisma.attendance.findUnique({
      where: { userId_meetingId: { userId: parsedUserId, meetingId: parsedMeetingId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Attendance for this user and meeting already exists' },
        { status: 409 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: parsedUserId,
        meetingId: parsedMeetingId,
        status: status as AttendanceStatus,
        checkedInAt: checkedInAt ? new Date(checkedInAt) : null,
        checkedOutAt: checkedOutAt ? new Date(checkedOutAt) : null,
        notes: notes ?? null,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}