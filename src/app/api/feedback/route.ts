import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Gets all feedback records
 * @returns the feedback records
 */
export async function GET(): Promise<NextResponse> {
  try {
    const feedback = await prisma.feedback.findMany({
      include: {
        meeting: true,
        author: true
      }
    });
    return NextResponse.json(feedback, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get feedback' }, { status: 500 });
  }
}