import { requireOfficerApi } from "@/lib/auth/requireOfficerApi";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Gets a single team by id, including its members.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error } = await requireOfficerApi();
        if (error) return error;
        
        const { id } = await params;
        const teamId = parseInt(id);

        if (isNaN(teamId)) {
            return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
        }

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    include: { user: true },
                },
            },
        });

        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        return NextResponse.json(team, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to get team" }, { status: 500 });
    }
}

/**
 * Updates a team's name, description, and/or active status.
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error } = await requireOfficerApi();
        if (error) return error;
        
        const { id } = await params;
        const teamId = parseInt(id);

        if (isNaN(teamId)) {
            return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
        }

        const { name, description, isActive } = await request.json();

        // Require at least one updatable field
        if (name === undefined && description === undefined && isActive === undefined) {
            return NextResponse.json(
                { error: "Provide at least one of: name, description, isActive" },
                { status: 400 }
            );
        }

        const existingTeam = await prisma.team.findUnique({ where: { id: teamId } });
        if (!existingTeam) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        const updatedTeam = await prisma.team.update({
            where: { id: teamId },
            data: {
                ...(name !== undefined ? { name } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
            },
        });

        return NextResponse.json(updatedTeam, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
    }
}

/**
 * Deletes a team by id (its team_member rows cascade).
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error } = await requireOfficerApi();
        if (error) return error;
        
        const { id } = await params;
        const teamId = parseInt(id);

        if (isNaN(teamId)) {
            return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
        }

        const existingTeam = await prisma.team.findUnique({ where: { id: teamId } });
        if (!existingTeam) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        await prisma.team.delete({ where: { id: teamId } });

        return NextResponse.json(
            { message: "Team deleted successfully", team: existingTeam },
            { status: 200 }
        );
    } catch (error) {
        
        return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
    }
}
