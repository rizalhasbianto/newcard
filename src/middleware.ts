// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/", "/admin"];
  const isPathProtected = protectedPaths?.some((path) => pathname == path);
  const res = NextResponse.next();
  if (isPathProtected) {
    const token = await getToken({
      req: req,
      secret: process.env.SECRET,
    });
    console.log("token", token)
    if (!token) {
      const url = new URL(`/auth/login`, req.url);
      return NextResponse.redirect(url);
    }
  }
  return res;
}