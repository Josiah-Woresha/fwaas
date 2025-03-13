import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware executed for:', req.nextUrl.pathname);

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Ensure session is fetched
  await supabase.auth.getSession();  

  const { data: { user } } = await supabase.auth.getUser();
  console.log('Middleware User:', user);

  // Redirect unauthenticated users trying to access protected routes
  if (!user && req.nextUrl.pathname !== '/auth/login') {
    console.log('Redirecting to login...');
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Redirect authenticated users away from login page
  if (user && req.nextUrl.pathname === '/auth/loggedin') {
    console.log('Redirecting to home...');
    const redirectRes = NextResponse.redirect(new URL('/auth/loggedin', req.url));
    redirectRes.headers.set('Location', '/'); // Ensure redirect
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ['/', '/auth/login', '/dashboard/:path*'], // Include all protected routes
};
