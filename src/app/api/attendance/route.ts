import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        user: true,
        meeting: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}
