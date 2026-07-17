import { verifyCheckInCode } from "@/lib/attendance/check-in-code";
import { syncUserToDb } from "@/lib/auth/sync-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Not autheticated" }, { status: 401 });
    }

    const { meetingId, code } = await request.json();

    if (!meetingId || !code) {
        return NextResponse.json(
            { error: "meetingId and code are required" },
            { status: 400 }
        );
    }

    const parsedMeetingId = parseInt(meetingId);
    if(isNaN(parsedMeetingId)) {
        return NextResponse.json(
            { error: "meetingId must be a valid integer" },
            { status: 400 }
        );
    }

    if(!verifyCheckInCode(parsedMeetingId, code)) {
        return NextResponse.json(
            { error: "Invalid check-in code" },
            { status: 403 }
        );
    }

    await syncUserToDb(user);
    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if(!dbUser) {
        return NextResponse.json(
            { error: "User record not found" },
            { status: 404 }
        );
    }

    try {
        const attendance = await prisma.attendance.upsert({
            where: {
                userId_meetingId: {
                    userId: dbUser.id,
                    meetingId: parsedMeetingId,
                },
            },
            update: {
                status: AttendanceStatus.PRESENT,
                checkedInAt: new Date(),
            },
            create: {
                userId: dbUser.id,
                meetingId: parsedMeetingId,
                status: AttendanceStatus.PRESENT,
                checkedInAt: new Date(),
            },
        });

        return NextResponse.json(attendance, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to check in" },
            { status: 500}
        );
    }
}