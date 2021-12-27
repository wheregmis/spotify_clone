import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token wil exists if the user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the request to continue if the following is true
  // 1. its a request for next-auth session & provider fetching
  // 2. if the token exists
  if (pathname.includes("/api/auth" || token)) {
    return NextResponse.next();
  }
  // redirect them to login if the token does not exist
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
