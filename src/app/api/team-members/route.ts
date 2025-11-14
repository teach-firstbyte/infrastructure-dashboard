import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { TeamRole } from '@prisma/client';

/**
 * Creates a new team member
 * @param request - The request object
 * @returns The response object
 */
export async function POST(request: Request): Promise<NextResponse> {

  try {

    // Validate the request body
    const { userId, teamId, role } = await request.json();

    // Check if the userId and teamId are provided
    if (!userId || !teamId || !role ) {
      return NextResponse.json({ error: 'userId, teamId, and role are required' }, { status: 400 });
    }

    // Validate and parse userId and teamId as integers
    const parsedUserId: number = parseInt(userId);
    const parsedTeamId: number = parseInt(teamId);
    
    if (isNaN(parsedUserId) || isNaN(parsedTeamId)) {
      return NextResponse.json({ error: 'userId and teamId must be valid integers' }, { status: 400 });
    }

    // Validate role using Prisma enum
    const validRoles = Object.values(TeamRole);
    if (role && !validRoles.includes(role as TeamRole)) {
      return NextResponse.json({ 
        error: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      }, { status: 400 });
    }

    // Create the team member
    const teamMember = await prisma.teamMember.create({
      data: { 
        userId: parsedUserId, 
        teamId: parsedTeamId,
        role: role as TeamRole
      },
    });

    // Return the team member if successful!
    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    // Return an error response if failed to create team member!
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}