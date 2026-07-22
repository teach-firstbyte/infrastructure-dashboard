import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TeamRole } from "@prisma/client";
import { requireOfficerApi } from "@/lib/auth/requireOfficerApi";

/**
 * Gets a single team member by id, including their user and team.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error } = await requireOfficerApi();
        if (error) return error;
        
        const { id } = await params;
        const teamMemberId = parseInt(id);

        if (isNaN(teamMemberId)) {
            return NextResponse.json(
                { error: "Invalid team member ID" },
                { status: 400 }
            );
        }

        const teamMember = await prisma.teamMember.findUnique({
            where: { id: teamMemberId },
            include: { user: true, team: true },
        });

        if (!teamMember) {
            return NextResponse.json(
                { error: "Team member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(teamMember, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to get team member" },
            { status: 500 }
        );
    }
}

/**
 * Updates a team member's role (e.g. promote MEMBER to LEAD).
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error } = await requireOfficerApi();
        if (error) return error;

        const { id } = await params;
        const teamMemberId = parseInt(id);

        if (isNaN(teamMemberId)) {
            return NextResponse.json(
                { error: "Invalid team member ID" },
                { status: 400 }
            );
        }

        const { role } = await request.json();

        if (!role) {
            return NextResponse.json({ error: "role is required" }, { status: 400 });
        }

        const validRoles = Object.values(TeamRole);
        if (!validRoles.includes(role as TeamRole)) {
            return NextResponse.json(
                { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
                { status: 400 }
            );
        }

        const existing = await prisma.teamMember.findUnique({
            where: { id: teamMemberId },
        });
        if (!existing) {
            return NextResponse.json(
                { error: "Team member not found" },
                { status: 404 }
            );
        }

        const updated = await prisma.teamMember.update({
            where: { id: teamMemberId },
            data: { role: role as TeamRole },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("PATCH team-member error:", error);
        return NextResponse.json(
            { error: "Failed to update team member" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error } = await requireOfficerApi();
        if (error) return error;
        
        const { id } = await params;
        const teamMemberId = parseInt(id);

        if (isNaN(teamMemberId)) {
            return NextResponse.json(
                { error: "Invalid team member ID" },
                { status: 400 }
            );
        }

        const existingTeamMember = await prisma.teamMember.findUnique({
            where: { id: teamMemberId },
        });

        if (!existingTeamMember) {
            return NextResponse.json(
                { error: "Team member not found" },
                { status: 404 }
            );
        }

        await prisma.teamMember.delete({
            where: { id: teamMemberId },
        });

        return NextResponse.json({
            message: 'Team member deleted successfully',
            teamMember: existingTeamMember
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete team member' },
            { status: 500 }
        );
    }
}