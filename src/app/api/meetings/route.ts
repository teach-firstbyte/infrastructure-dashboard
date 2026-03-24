import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Gets all meetings
 * @returns the meetings
 */
export async function GET(): Promise<NextResponse> {
  try {
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get meetings' }, { status: 500 });
  }
}