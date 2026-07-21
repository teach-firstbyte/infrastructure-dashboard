import { requireOfficerApi } from "@/lib/auth/requireOfficerApi";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { error } = await requireOfficerApi();
    if (error) return error;

    const teams = await prisma.team.findMany({
      include: {
        members: {
            include: {
                user: true
            }
        }
      }
    });
    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get teams' }, { status: 500 });
  }
}

/**
 * Creates a new team
 * @param request - The request object
 * @returns The created team
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { error } = await requireOfficerApi();
    if (error) return error;
    
    // Validate the request body
    const { name, description, isActive } = await request.json();

    // name is the only required field on the model
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    // Create the team
    const team = await prisma.team.create({
      data: {
        name,
        description: description ?? null,
        // isActive defaults to true in the schema; only override when provided
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {

    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}