import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicUrl } from "@/lib/public-url";

export function middleware(request: NextRequest) {
  const password = process.env.ACCESS_PASSWORD?.trim();
  if (!password) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("ekonomiya_session");
  if (session?.value === "ok") return NextResponse.next();

  const q = new URLSearchParams({ from: pathname });
  return NextResponse.redirect(`/login?${q}`);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.png|logo-mark.png|manifest.webmanifest|sw.js|splash.png|icons/|brand/).*)",
  ],
};
