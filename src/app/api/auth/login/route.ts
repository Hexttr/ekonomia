import { NextResponse } from "next/server";
import { checkPassword, sessionCookieOptions } from "@/lib/auth";

const COOKIE = "ekonomiya_session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");
  const safeFrom = from.startsWith("/") ? from : "/";

  if (!checkPassword(password)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("from", safeFrom);
    return NextResponse.redirect(url);
  }

  const target = new URL(safeFrom, request.url);
  const response = NextResponse.redirect(target);
  response.cookies.set(COOKIE, "ok", sessionCookieOptions());
  return response;
}
