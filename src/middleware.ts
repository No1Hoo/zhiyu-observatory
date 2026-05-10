import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_COOKIE = "admin-session";

function verifySessionToken(token: string, password: string): boolean {
  if (!token || !password) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, hmac] = parts;
  const expectedHmac = crypto.createHmac("sha256", password).update(timestamp).digest("hex");
  return hmac === expectedHmac;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths - no auth required
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Admin routes require auth
  if (pathname.startsWith("/admin")) {
    // No password configured - skip auth (dev mode)
    if (!ADMIN_PASSWORD) {
      return NextResponse.next();
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);
    const token = sessionCookie?.value;

    if (!token || !verifySessionToken(token, ADMIN_PASSWORD)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};