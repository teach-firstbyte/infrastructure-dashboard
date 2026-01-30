import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function middleware(request: NextRequest) {


  // Create Supabase client that can read cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
      },
    }
  );

  // Get the logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    
  // which routes need protection
  const publicRoutes = ['/api/auth/signin', '/api/auth/signup', '/api/auth/signout', '/api/auth/google'];
  const adminRoutes = ['/api/admin/signin'];

    const path = request.nextUrl.pathname;
    const method = request.method;

  // check if this route needs protection
  const isPublicRoute = publicRoutes.some(route => path === route);
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isMutating = method === 'POST' || method === 'PUT' || method === 'DELETE';
  


  // if not a protected route, allow through
  if (!isAdminRoute && isPublicRoute) {
    return NextResponse.next();
  }

  // if not logged in, reject for next steps
  if (!user) {
    return NextResponse.json(
      { error: 'Not logged in' },
      { status: 401 }
    );
  }
    //gets user from db
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
    });

  // for admin routes, check role
    if (isAdminRoute || (isMutating)) {
        if (dbUser?.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }
  }

  // allowed ->continue
  return NextResponse.next();
}

// Which routes middleware runs on
export const config = {
  matcher: '/api/:path*'
};