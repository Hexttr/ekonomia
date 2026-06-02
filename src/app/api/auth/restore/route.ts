import { NextResponse } from "next/server";
import { attachSessionCookies } from "@/lib/attach-session";
import { publicUrl } from "@/lib/public-url";
import { createRememberToken, verifyRememberToken } from "@/lib/session-token";

/** Восстановление сессии из localStorage (PWA на телефоне). */
export async function POST(request: Request) {
  let token: string | undefined;
  try {
    const body = await request.json();
    token = typeof body?.token === "string" ? body.token : undefined;
  } catch {
    token = undefined;
  }

  if (!token || !(await verifyRememberToken(token))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const fresh = await createRememberToken();
  const from = new URL(request.url).searchParams.get("from") || "/";
  const safeFrom = from.startsWith("/") ? from : "/";
  const response = NextResponse.redirect(publicUrl(request, safeFrom));
  attachSessionCookies(response, fresh);
  return response;
}
