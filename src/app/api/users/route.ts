import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 [DEBUG] Starting users API call')
    console.log('🔍 [DEBUG] DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('🔍 [DEBUG] DATABASE_URL starts with postgresql:', process.env.DATABASE_URL?.startsWith('postgresql://'))
    
    const users = await prisma.user.findMany({
      include: {
        teamMemberships: {
          include: {
            team: true
          }
        }
      }
    })

    console.log('✅ [DEBUG] Successfully fetched users:', users.length)
    return NextResponse.json(users)
  } catch (error) {
    console.error('❌ [DEBUG] Error fetching users:', error)
    console.error('❌ [DEBUG] Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('❌ [DEBUG] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
