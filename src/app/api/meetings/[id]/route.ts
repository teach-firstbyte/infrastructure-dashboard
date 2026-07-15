import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { MeetingType } from "@prisma/client";

/**
 * Gets a single meeting by id, including attendance and feedback.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const meetingId = parseInt(id);

        if (isNaN(meetingId)) {
            return NextResponse.json({ error: "Invalid meeting ID" }, { status: 400 });
        }

        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: {
                attendance: { include: { user: true } },
                feedback: true,
            },
        });

        if (!meeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }

        return NextResponse.json(meeting, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to get meeting" }, { status: 500 });
    }
}

/**
 * Updates a meeting's details. All fields are optional; only the
 * provided ones are changed.
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const meetingId = parseInt(id);

        if (isNaN(meetingId)) {
            return NextResponse.json({ error: "Invalid meeting ID" }, { status: 400 });
        }

        const {
            title,
            description,
            type,
            teamId,
            scheduledAt,
            startedAt,
            endedAt,
            location,
            isRequired,
            maxCapacity,
        } = await request.json();

        // Validate type against the enum when provided
        if (type !== undefined) {
            const validTypes = Object.values(MeetingType);
            if (!validTypes.includes(type as MeetingType)) {
                return NextResponse.json(
                    { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
                    { status: 400 }
                );
            }
        }

        // Validate date fields when provided
        const parseDateField = (value: unknown): Date | null | undefined => {
            if (value === undefined) return undefined;
            if (value === null) return null;
            const d = new Date(value as string);
            return isNaN(d.getTime()) ? undefined : d;
        };

        const parsedScheduledAt = parseDateField(scheduledAt);
        const parsedStartedAt = parseDateField(startedAt);
        const parsedEndedAt = parseDateField(endedAt);
        if (
            (scheduledAt !== undefined && parsedScheduledAt === undefined) ||
            (startedAt !== undefined && startedAt !== null && parsedStartedAt === undefined) ||
            (endedAt !== undefined && endedAt !== null && parsedEndedAt === undefined)
        ) {
            return NextResponse.json(
                { error: "scheduledAt, startedAt, and endedAt must be valid dates" },
                { status: 400 }
            );
        }

        // Validate optional integer fields when provided
        let parsedTeamId: number | null | undefined;
        if (teamId !== undefined) {
            if (teamId === null) {
                parsedTeamId = null;
            } else {
                parsedTeamId = parseInt(teamId);
                if (isNaN(parsedTeamId)) {
                    return NextResponse.json(
                        { error: "teamId must be a valid integer" },
                        { status: 400 }
                    );
                }
            }
        }

        let parsedMaxCapacity: number | null | undefined;
        if (maxCapacity !== undefined) {
            if (maxCapacity === null) {
                parsedMaxCapacity = null;
            } else {
                parsedMaxCapacity = parseInt(maxCapacity);
                if (isNaN(parsedMaxCapacity)) {
                    return NextResponse.json(
                        { error: "maxCapacity must be a valid integer" },
                        { status: 400 }
                    );
                }
            }
        }

        const existing = await prisma.meeting.findUnique({ where: { id: meetingId } });
        if (!existing) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }

        const updated = await prisma.meeting.update({
            where: { id: meetingId },
            data: {
                ...(title !== undefined ? { title } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(type !== undefined ? { type: type as MeetingType } : {}),
                ...(parsedTeamId !== undefined ? { teamId: parsedTeamId } : {}),
                ...(parsedScheduledAt !== undefined ? { scheduledAt: parsedScheduledAt ?? undefined } : {}),
                ...(parsedStartedAt !== undefined ? { startedAt: parsedStartedAt } : {}),
                ...(parsedEndedAt !== undefined ? { endedAt: parsedEndedAt } : {}),
                ...(location !== undefined ? { location } : {}),
                ...(isRequired !== undefined ? { isRequired: Boolean(isRequired) } : {}),
                ...(parsedMaxCapacity !== undefined ? { maxCapacity: parsedMaxCapacity } : {}),
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update meeting" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // get meeting ID
        const meetingId = parseInt(id);

        // check that the ID is a number
        if (isNaN(meetingId)) {
            return NextResponse.json(
                { error: "Invalid meeting ID" },
                { status: 400 }
            );
        }

        // check if this meeting exists in the database
        const existingMeeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
        });

        if (!existingMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 }
            );
        }

        // delete the meeting (attendance + feedback cascade on delete)
        await prisma.meeting.delete({
            where: { id: meetingId },
        });

        return NextResponse.json(
        {
            message: 'Meeting deleted successfully',
            meeting: existingMeeting
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to delete meeting'
            },
            {
                status: 500
            }
        );
    }
}
