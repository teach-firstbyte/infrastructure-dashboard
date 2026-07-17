import { generateCheckInCode } from "@/lib/attendance/check-in-code";
import { prisma } from "@/lib/prisma";
import { CheckInQR } from "./CheckInQR";
import { requireOfficer } from "@/lib/auth/requireOfficer";

export default async function CheckInDisplayPage({
    params,
} : {
    params: Promise<{ meetingId: string }>;
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

    //Server-only: generate the code with the secret. Only 'code' + 'path' cross to the client.
    const code = generateCheckInCode(parsedMeetingId);
    const path = `/check-in/${parsedMeetingId}?code=${code}`;

    return (
        <div className="container mx-auto max-w-md p-6">
            <CheckInQR meetingTitle={meeting.title} code={code} path={path} />
        </div>
    );
}