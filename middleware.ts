import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth') || req.nextUrl.pathname.startsWith('/login');
  
  // Debug logging
  console.log('Middleware check:', {
    path: req.nextUrl.pathname,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    isAuthRoute
  });
  
  // Protect API routes
  if (!token && req.nextUrl.pathname.startsWith('/api') && !isAuthRoute) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Redirect to login if no token and trying to access protected routes
  if (!token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'] };
