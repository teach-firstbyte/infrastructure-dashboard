import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AttendanceToggle } from "./AttendanceToggle";

export default async function MeetingAttendancePage({
    params,
}: {
    params: Promise<{ meetingId: string }>
}) {
    const { meetingId } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const parsedMeetingId = parseInt(meetingId);
    if (isNaN(parsedMeetingId)) {
        return <p className="p-6 text-center">Invalid meeting.</p>
    }

    const meeting = await prisma.meeting.findUnique({ where: { id: parsedMeetingId } });
    if (!meeting) {
        return <p className="p-6 text-center">Meeting not found.</p>
    }

    return (
        <div className="container mx-auto max-w-2xl p-6">
            <AttendanceToggle meetingId={parsedMeetingId} meetingTitle={meeting.title} />
        </div>
    )
}