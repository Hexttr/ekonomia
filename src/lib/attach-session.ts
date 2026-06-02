import type { NextResponse } from "next/server";
import {
  REMEMBER_COOKIE,
  rememberCookieOptions,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "./auth";

/** Выставить обе cookie сессии на ответ (login / restore). */
export function attachSessionCookies(response: NextResponse, rememberToken: string) {
  response.cookies.set(SESSION_COOKIE, "ok", sessionCookieOptions());
  response.cookies.set(REMEMBER_COOKIE, rememberToken, rememberCookieOptions());
}
