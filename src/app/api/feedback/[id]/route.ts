import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { FeedbackCategory } from "@prisma/client";

/**
 * Gets a single feedback record by id.
 */
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const feedbackId = parseInt(params.id);

        if (isNaN(feedbackId)) {
            return NextResponse.json({ error: "Invalid feedback ID" }, { status: 400 });
        }

        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            include: { meeting: true, author: true },
        });

        if (!feedback) {
            return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
        }

        return NextResponse.json(feedback, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to get feedback" }, { status: 500 });
    }
}

/**
 * Updates a feedback record's rating, comment, category, and/or anonymity.
 */
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const feedbackId = parseInt(params.id);

        if (isNaN(feedbackId)) {
            return NextResponse.json({ error: "Invalid feedback ID" }, { status: 400 });
        }

        const { rating, comment, category, isAnonymous } = await request.json();

        if (
            rating === undefined &&
            comment === undefined &&
            category === undefined &&
            isAnonymous === undefined
        ) {
            return NextResponse.json(
                { error: "Provide at least one of: rating, comment, category, isAnonymous" },
                { status: 400 }
            );
        }

        // Validate rating range when provided (null clears it)
        let parsedRating: number | null | undefined;
        if (rating !== undefined) {
            if (rating === null) {
                parsedRating = null;
            } else {
                parsedRating = parseInt(rating);
                if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
                    return NextResponse.json(
                        { error: "rating must be an integer between 1 and 5" },
                        { status: 400 }
                    );
                }
            }
        }

        // Validate category enum when provided
        if (category !== undefined && category !== null) {
            const validCategories = Object.values(FeedbackCategory);
            if (!validCategories.includes(category as FeedbackCategory)) {
                return NextResponse.json(
                    { error: `Invalid category. Must be one of: ${validCategories.join(", ")}` },
                    { status: 400 }
                );
            }
        }

        const existing = await prisma.feedback.findUnique({ where: { id: feedbackId } });
        if (!existing) {
            return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
        }

        const updated = await prisma.feedback.update({
            where: { id: feedbackId },
            data: {
                ...(parsedRating !== undefined ? { rating: parsedRating } : {}),
                ...(comment !== undefined ? { comment } : {}),
                ...(category !== undefined
                    ? { category: (category as FeedbackCategory) ?? null }
                    : {}),
                ...(isAnonymous !== undefined ? { isAnonymous: Boolean(isAnonymous) } : {}),
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
    }
}

/**
 * Deletes a feedback record by id.
 */
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const feedbackId = parseInt(params.id);

        if (isNaN(feedbackId)) {
            return NextResponse.json({ error: "Invalid feedback ID" }, { status: 400 });
        }

        const existing = await prisma.feedback.findUnique({ where: { id: feedbackId } });
        if (!existing) {
            return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
        }

        await prisma.feedback.delete({ where: { id: feedbackId } });

        return NextResponse.json(
            { message: "Feedback deleted successfully", feedback: existing },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 });
    }
}
