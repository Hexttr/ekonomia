import { cookies } from "next/headers";
import {
  REMEMBER_COOKIE,
  SESSION_COOKIE,
  rememberCookieOptions,
  sessionCookieOptions,
} from "./auth-cookies";

export {
  REMEMBER_COOKIE,
  REMEMBER_STORAGE_KEY,
  SESSION_COOKIE,
  rememberCookieOptions,
  sessionCookieOptions,
  sessionMaxAgeSec,
} from "./auth-cookies";

export function isAuthEnabled(): boolean {
  return Boolean(process.env.ACCESS_PASSWORD?.trim());
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
