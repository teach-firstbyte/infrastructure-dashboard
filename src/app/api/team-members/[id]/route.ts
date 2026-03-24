import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // get team-member ID
        const teamMemberId = parseInt(params.id);

        // check that the ID is a number
        if (isNaN(teamMemberId)) {
            return NextResponse.json(
                { error: "Invalid team member ID" },
                { status: 400 }
            );
        }

        // check if this team member exists in the database
        const existingTeamMember = await prisma.teamMember.findUnique({
            where: { id: teamMemberId },
        });

        if (!existingTeamMember) {
            return NextResponse.json(
                { error: "Team member not found" },
                { status: 404 }
            );
        }

        // delete the team member
        await prisma.teamMember.delete({
            where: { id: teamMemberId },
        });

        return NextResponse.json(
        {
            message: 'Team member deleted successfully',
            teamMember: existingTeamMember
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to delete team member'
            },
            {
                status: 500
            }
        );
    }
}