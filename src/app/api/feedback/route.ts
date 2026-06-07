import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { FeedbackCategory } from "@prisma/client";

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

/**
 * Submits feedback for a meeting
 * @param request - The request object
 * @returns The created feedback record
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { meetingId, authorId, rating, comment, category, isAnonymous } =
      await request.json();

    // meetingId and authorId are required
    if (!meetingId || !authorId) {
      return NextResponse.json(
        { error: 'meetingId and authorId are required' },
        { status: 400 }
      );
    }

    const parsedMeetingId = parseInt(meetingId);
    const parsedAuthorId = parseInt(authorId);
    if (isNaN(parsedMeetingId) || isNaN(parsedAuthorId)) {
      return NextResponse.json(
        { error: 'meetingId and authorId must be valid integers' },
        { status: 400 }
      );
    }

    // rating is optional, but must be 1-5 when provided
    let parsedRating: number | null = null;
    if (rating !== undefined && rating !== null) {
      parsedRating = parseInt(rating);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return NextResponse.json(
          { error: 'rating must be an integer between 1 and 5' },
          { status: 400 }
        );
      }
    }

    // category is optional, but must be a valid enum value when provided
    if (category !== undefined && category !== null) {
      const validCategories = Object.values(FeedbackCategory);
      if (!validCategories.includes(category as FeedbackCategory)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const feedback = await prisma.feedback.create({
      data: {
        meetingId: parsedMeetingId,
        authorId: parsedAuthorId,
        rating: parsedRating,
        comment: comment ?? null,
        category: (category as FeedbackCategory) ?? null,
        isAnonymous: isAnonymous ?? false,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}