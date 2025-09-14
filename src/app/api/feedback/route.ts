import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      include: {
        meeting: true,
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}
