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
  }
}