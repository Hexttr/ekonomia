import { cookies } from "next/headers";
import { REMEMBER_MAX_AGE_SEC } from "./session-token";

export const SESSION_COOKIE = "ekonomiya_session";
export const REMEMBER_COOKIE = "ekonomiya_remember";
export const REMEMBER_STORAGE_KEY = "ekonomiya_remember";

/** Срок сессии (секунды), по умолчанию 10 лет */
export function sessionMaxAgeSec(): number {
  const raw = process.env.SESSION_MAX_AGE_SEC?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return REMEMBER_MAX_AGE_SEC;
}

export function isAuthEnabled(): boolean {
  return Boolean(process.env.ACCESS_PASSWORD?.trim());
}

export function isCookieSecure(): boolean {
  const v = process.env.COOKIE_SECURE?.trim().toLowerCase();
  return v === "true" || v === "1";
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isCookieSecure(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: sessionMaxAgeSec(),
  };
}

export function rememberCookieOptions() {
  return {
    httpOnly: false,
    secure: isCookieSecure(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: sessionMaxAgeSec(),
  };
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isAuthEnabled()) return true;
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === "ok";
}

export async function setAuthenticated(rememberToken?: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "ok", sessionCookieOptions());
  if (rememberToken) {
    store.set(REMEMBER_COOKIE, rememberToken, rememberCookieOptions());
  }
}

export async function clearAuthenticated(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(REMEMBER_COOKIE);
}

export function checkPassword(password: string): boolean {
  return password === process.env.ACCESS_PASSWORD;
}
