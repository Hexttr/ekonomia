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
