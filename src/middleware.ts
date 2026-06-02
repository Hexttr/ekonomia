import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  REMEMBER_COOKIE,
  SESSION_COOKIE,
  rememberCookieOptions,
  sessionCookieOptions,
} from "@/lib/auth-cookies";
import { publicUrl } from "@/lib/public-url";
import { verifyRememberToken } from "@/lib/session-token";

export async function middleware(request: NextRequest) {
  const password = process.env.ACCESS_PASSWORD?.trim();
  if (!password) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE);
  if (session?.value === "ok") return NextResponse.next();

  const remember = request.cookies.get(REMEMBER_COOKIE)?.value;
  if (remember && (await verifyRememberToken(remember))) {
    const res = NextResponse.next();
    res.cookies.set(SESSION_COOKIE, "ok", sessionCookieOptions());
    res.cookies.set(REMEMBER_COOKIE, remember, rememberCookieOptions());
    return res;
  }

  const q = new URLSearchParams({ from: pathname });
  return NextResponse.redirect(publicUrl(request, `/login?${q}`));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.png|logo-mark.png|manifest.webmanifest|sw.js|splash.png|icons/|brand/).*)",
  ],
};
