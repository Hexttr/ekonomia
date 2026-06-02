import { cookies } from "next/headers";

const COOKIE = "ekonomiya_session";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 год

export function isAuthEnabled(): boolean {
  return Boolean(process.env.ACCESS_PASSWORD?.trim());
}

/** Secure только при HTTPS (COOKIE_SECURE=true). По HTTP cookie иначе не сохраняется. */
export function isCookieSecure(): boolean {
  const v = process.env.COOKIE_SECURE?.trim().toLowerCase();
  return v === "true" || v === "1";
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isAuthEnabled()) return true;
  const store = await cookies();
  return store.get(COOKIE)?.value === "ok";
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isCookieSecure(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  };
}

export async function setAuthenticated(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, "ok", sessionCookieOptions());
}

export async function clearAuthenticated(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export function checkPassword(password: string): boolean {
  return password === process.env.ACCESS_PASSWORD;
}
