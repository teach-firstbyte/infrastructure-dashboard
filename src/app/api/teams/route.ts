import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
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