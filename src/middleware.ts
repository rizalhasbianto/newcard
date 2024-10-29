import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/; // Files

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.clone();
    const host = req.headers.get('host');

    if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes('_next') || url.pathname.includes('api') || url.pathname.includes('auth')) return;
    
    if ( req.nextUrl.pathname.startsWith('/companies') && req.nextauth.token.role === "customer" ) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if ( req.nextUrl.pathname === "/" && req.nextauth.token.role === "admin" ) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if(req.nextauth.token.role === "customer") {
      const companyID = req.nextauth.token.company["companyId"]?.replace(/[^a-z0-9 _-]/gi, '-').toLowerCase()
      if(companyID) {
        url.pathname = `/company/${companyID}${url.pathname}`;
      }
    }
    return NextResponse.rewrite(url);
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

