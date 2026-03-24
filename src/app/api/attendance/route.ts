import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Gets all attendance records
 * @returns the attendance records
 */
export async function GET(): Promise<NextResponse> {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        user: true,
        meeting: true
      }
    });
    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get attendance' }, { status: 500 });
  }
}