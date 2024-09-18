import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if ( req.nextUrl.pathname.startsWith('/companies') && req.nextauth.token.role === "customer" ) {
        return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token
      },
    },
    pages: {
      signIn: "/auth/login",
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
    '/((?!_next/static|_next/public|assets|assets|email/images|_next/image|certor.png|favicon.ico|auth).*)',
  ],
}

