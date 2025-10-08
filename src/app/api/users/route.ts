import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Creates a new user
 * @param request - The request object
 * @returns The response object
 */
export async function POST(request: Request): Promise<NextResponse> {

  try {

    // Validate the request body
    const { email, name } = await request.json();

    // Check if the email and name are provided
    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Create the user
    const user = await prisma.user.create({
      data: { email: email, name: name },
    });

    // Return the user if successful!
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // Return an error response if failed to create user!
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}