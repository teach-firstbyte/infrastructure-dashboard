import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { MeetingType } from "@prisma/client";
import { requireOfficerApi } from "@/lib/auth/requireOfficerApi";
import { requireUserApi } from "@/lib/auth/requireUserApi";
import { isOfficer } from "@/lib/auth/roles";

/**
 * Gets all meetings
 * @returns the meetings
 */
export async function GET(): Promise<NextResponse> {
  try {
    const { user, error } = await requireUserApi();
    if (error) return error;

    if(isOfficer(user)) {
      const meetings = await prisma.meeting.findMany({
        include: {
          attendance: {
              include: {
                  user: true
              }
          },
          feedback: true
        }
      });
      return NextResponse.json(meetings, { status: 200 });
    }
    
    const memberships = await prisma.teamMember.findMany({
      where: { userId: user.id },
      select: { teamId: true },
    })

    const teamIds = memberships.map((m) => m.teamId);

    // grace window: keep in-progess meetings visible ˜2 hrs past start
    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

    const meetings = await prisma.meeting.findMany({
      where: {
        scheduledAt: { gt: new Date(Date.now() - TWO_HOURS_MS) },
        OR: [
          { teamId: null },
          { teamId: { in: teamIds } }
        ]
      }
    })

    return NextResponse.json(meetings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get meetings' }, { status: 500 });
  }
}

/**
 * Creates a new meeting
 * @param request - The request object
 * @returns The created meeting
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { error } = await requireOfficerApi();
    if (error) return error;
    
    // Validate the request body
    const {
      title,
      description,
      type,
      teamId,
      scheduledAt,
      location,
      isRequired,
      maxCapacity,
    } = await request.json();

    // title, type, and scheduledAt are the required fields on the model
    if (!title || !type || !scheduledAt) {
      return NextResponse.json(
        { error: 'title, type, and scheduledAt are required' },
        { status: 400 }
      );
    }

    // Validate type using the Prisma enum
    const validTypes = Object.values(MeetingType);
    if (!validTypes.includes(type as MeetingType)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // scheduledAt must be a valid date
    const parsedScheduledAt = new Date(scheduledAt);
    if (isNaN(parsedScheduledAt.getTime())) {
      return NextResponse.json(
        { error: 'scheduledAt must be a valid date' },
        { status: 400 }
      );
    }

    // teamId and maxCapacity are optional, but must be valid integers if provided
    let parsedTeamId: number | undefined;
    if (teamId !== undefined && teamId !== null) {
      parsedTeamId = parseInt(teamId);
      if (isNaN(parsedTeamId)) {
        return NextResponse.json(
          { error: 'teamId must be a valid integer' },
          { status: 400 }
        );
      }
    }

    let parsedMaxCapacity: number | undefined;
    if (maxCapacity !== undefined && maxCapacity !== null) {
      parsedMaxCapacity = parseInt(maxCapacity);
      if (isNaN(parsedMaxCapacity)) {
        return NextResponse.json(
          { error: 'maxCapacity must be a valid integer' },
          { status: 400 }
        );
      }
    }

    // Create the meeting
    const meeting = await prisma.meeting.create({
      data: {
        title,
        description: description ?? null,
        type: type as MeetingType,
        teamId: parsedTeamId ?? null,
        scheduledAt: parsedScheduledAt,
        location: location ?? null,
        isRequired: isRequired ?? false,
        maxCapacity: parsedMaxCapacity ?? null,
      },
    });

    // Determine the expected roster for this meeting.
    // Team meeting (teamId set) -> that team's members.
    // General meeting (teamId null) -> all club members.
    let expectedUserIds: number[];

    if (meeting.teamId != null) {
      const teamMembers = await prisma.teamMember.findMany({
        where: { teamId: meeting.teamId },
        select: { userId: true },
      });
      expectedUserIds = teamMembers.map((m) => m.userId);
    } else {
      const allUsers = await prisma.user.findMany({
        select: { id: true },
      });
      expectedUserIds = allUsers.map((u) => u.id)
    }

    if (expectedUserIds.length > 0) {
      await prisma.attendance.createMany({
        data: expectedUserIds.map((userId) => ({
          userId,
          meetingId: meeting.id,
          status: "REGISTERED" as const
        })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}