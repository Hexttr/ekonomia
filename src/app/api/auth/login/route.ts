import { NextResponse } from "next/server";
import { checkPassword, sessionCookieOptions } from "@/lib/auth";

const COOKIE = "ekonomiya_session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");
  const safeFrom = from.startsWith("/") ? from : "/";

  if (!checkPassword(password)) {
    const q = new URLSearchParams({ error: "1", from: safeFrom });
    const response = NextResponse.redirect(`/login?${q}`);
    return response;
  }

  const response = NextResponse.redirect(safeFrom);
  response.cookies.set(COOKIE, "ok", sessionCookieOptions());
  return response;
}
