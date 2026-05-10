import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_COOKIE = "admin-session";

function createSessionToken(password: string): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", password).update(timestamp).digest("hex");
  return `${timestamp}.${hmac}`;
}

function verifySessionToken(token: string, password: string): boolean {
  if (!token || !password) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, hmac] = parts;
  const expectedHmac = crypto.createHmac("sha256", password).update(timestamp).digest("hex");
  return hmac === expectedHmac;
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!ADMIN_PASSWORD) {
      // Dev mode - no password set, skip auth
      return NextResponse.json({ ok: false, error: "未配置 ADMIN_PASSWORD" }, { status: 500 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "密码错误" }, { status: 401 });
    }

    const token = createSessionToken(ADMIN_PASSWORD);
    const response = NextResponse.json({ ok: true });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "请求格式错误" }, { status: 400 });
  }
}