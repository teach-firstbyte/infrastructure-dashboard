import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth/sync-user'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      await syncUserToDb(data.user)
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // Something went wrong — send them back to login with an error
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate with Google`)
}