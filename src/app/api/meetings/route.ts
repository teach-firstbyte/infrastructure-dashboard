import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        team: true,
        attendance: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    })

    return NextResponse.json(meetings)
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 })
  }
}
