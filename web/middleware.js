import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/settings', '/onboarding'];

// Routes only accessible when NOT logged in
const authRoutes = ['/signin', '/signup', '/verify-otp'];

// API routes that require auth (checked separately)
const protectedApiRoutes = [
  '/api/decisions',
  '/api/feedback',
  '/api/user',
  '/api/auth/provider-settings',
  '/api/auth/onboarding/complete',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get token from Authorization header (API) or cookie (page navigation)
  let token = null;

  // Check Authorization header first (for API calls from frontend using axios)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // Fall back to cookie (for page navigations)
  if (!token) {
    token = request.cookies.get('token')?.value || null;
  }

  // Verify token if present
  let isAuthenticated = false;
  let userId = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      isAuthenticated = true;
      userId = payload.userId;
    } catch {
      // Token is invalid or expired
      isAuthenticated = false;
    }
  }

  // --- Handle protected page routes ---
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/signin';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // --- Handle auth-only routes (redirect to dashboard if already logged in) ---
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // --- Handle protected API routes ---
  if (protectedApiRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected pages
    '/dashboard/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    // Auth pages
    '/signin',
    '/signup',
    '/verify-otp',
    // Protected API routes
    '/api/decisions/:path*',
    '/api/feedback/:path*',
    '/api/user/:path*',
    '/api/auth/provider-settings',
    '/api/auth/onboarding/complete',
  ],
};
