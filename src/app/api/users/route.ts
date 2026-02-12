import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: Request): Promise<NextResponse> {
  try {

    // Parses ID from the request body
    const { id } = await request.json();

    // if no ID provided, return error
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Deletes user from database
    const user = await prisma.user.delete({
      where: { id }
    });

    // if user not found, return error
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    } else {
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    }
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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