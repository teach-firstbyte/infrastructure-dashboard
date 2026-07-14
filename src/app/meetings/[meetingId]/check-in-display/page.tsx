import { generateCheckInCode } from "@/lib/attendance/check-in-code";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckInQR } from "./CheckInQR";

export default async function CheckInDisplayPage({
    params,
} : {
    params: Promise<{ meetingId: string }>;
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

    //Server-only: generate the code with the secret. Only 'code' + 'path' cross to the client.
    const code = generateCheckInCode(parsedMeetingId);
    const path = `/check-in/${parsedMeetingId}?code=${code}`;

    return (
        <div className="container mx-auto max-w-md p-6">
            <CheckInQR meetingTitle={meeting.title} code={code} path={path} />
        </div>
    );
}