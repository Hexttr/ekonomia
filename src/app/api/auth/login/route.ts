import { NextResponse } from "next/server";
import { checkPassword } from "@/lib/auth";
import { attachSessionCookies } from "@/lib/attach-session";
import { publicUrl } from "@/lib/public-url";
import { createRememberToken } from "@/lib/session-token";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");
  const safeFrom = from.startsWith("/") ? from : "/";

  if (!checkPassword(password)) {
    const q = new URLSearchParams({ error: "1", from: safeFrom });
    return NextResponse.redirect(publicUrl(request, `/login?${q}`));
  }

  const rememberToken = await createRememberToken();
  const response = NextResponse.redirect(publicUrl(request, safeFrom));
  attachSessionCookies(response, rememberToken);
  return response;
}
