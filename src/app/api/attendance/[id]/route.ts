import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AttendanceStatus } from "@prisma/client";

/**
 * Gets a single attendance record by id.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const attendanceId = parseInt(id);

        if (isNaN(attendanceId)) {
            return NextResponse.json({ error: "Invalid attendance ID" }, { status: 400 });
        }

        const attendance = await prisma.attendance.findUnique({
            where: { id: attendanceId },
            include: { user: true, meeting: true },
        });

        if (!attendance) {
            return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
        }

        return NextResponse.json(attendance, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to get attendance" }, { status: 500 });
    }
}

/**
 * Updates an attendance record's status, check-in/out times, and/or notes.
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const attendanceId = parseInt(id);

        if (isNaN(attendanceId)) {
            return NextResponse.json({ error: "Invalid attendance ID" }, { status: 400 });
        }

        const { status, checkedInAt, checkedOutAt, notes } = await request.json();

        if (
            status === undefined &&
            checkedInAt === undefined &&
            checkedOutAt === undefined &&
            notes === undefined
        ) {
            return NextResponse.json(
                { error: "Provide at least one of: status, checkedInAt, checkedOutAt, notes" },
                { status: 400 }
            );
        }

        // Validate status against the enum when provided
        if (status !== undefined) {
            const validStatuses = Object.values(AttendanceStatus);
            if (!validStatuses.includes(status as AttendanceStatus)) {
                return NextResponse.json(
                    { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                    { status: 400 }
                );
            }
        }

        const existing = await prisma.attendance.findUnique({ where: { id: attendanceId } });
        if (!existing) {
            return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
        }

        const updated = await prisma.attendance.update({
            where: { id: attendanceId },
            data: {
                ...(status !== undefined ? { status: status as AttendanceStatus } : {}),
                ...(checkedInAt !== undefined
                    ? { checkedInAt: checkedInAt ? new Date(checkedInAt) : null }
                    : {}),
                ...(checkedOutAt !== undefined
                    ? { checkedOutAt: checkedOutAt ? new Date(checkedOutAt) : null }
                    : {}),
                ...(notes !== undefined ? { notes } : {}),
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
    }
}

/**
 * Deletes an attendance record by id.
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise< { id: string } >}
) {
    try {
        const { id } = await params;
        const attendanceId = parseInt(id);

        if (isNaN(attendanceId)) {
            return NextResponse.json({ error: "Invalid attendance ID" }, { status: 400 });
        }

        const existing = await prisma.attendance.findUnique({ where: { id: attendanceId } });
        if (!existing) {
            return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
        }

        await prisma.attendance.delete({ where: { id: attendanceId } });

        return NextResponse.json(
            { message: "Attendance deleted successfully", attendance: existing },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete attendance" }, { status: 500 });
    }
}
