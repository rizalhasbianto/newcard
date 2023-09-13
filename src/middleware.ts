import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  {
    callbacks: {
      authorized({ token }) {
        return !!token
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/public|email/images|_next/image|favicon.ico|auth).*)',
  ],
}

