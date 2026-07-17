import { prisma } from "@/lib/prisma";
import { AttendanceToggle } from "./AttendanceToggle";
import { requireOfficer } from "@/lib/auth/requireOfficer";

export default async function MeetingAttendancePage({
    params,
}: {
    params: Promise<{ meetingId: string }>
}) {
    const officer = await requireOfficer();
    const { meetingId } = await params;

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