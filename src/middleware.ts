import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(

  function middleware(req) {
    // return NextResponse
    return NextResponse.rewrite(new URL("/", req.url));
  },
  {
    callbacks: {
      authorized({ token }) {
        return token !== null;
      },
    },
  }
);

export const config = { matcher: ["/"] };
