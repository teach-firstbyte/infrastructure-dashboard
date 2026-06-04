import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // get meeting ID
        const meetingId = parseInt(params.id);

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
