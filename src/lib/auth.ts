import { cookies } from "next/headers";

const COOKIE = "ekonomiya_session";

export function isAuthEnabled(): boolean {
  return Boolean(process.env.ACCESS_PASSWORD?.trim());
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isAuthEnabled()) return true;
  const store = await cookies();
  return store.get(COOKIE)?.value === "ok";
}

export async function setAuthenticated(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearAuthenticated(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export function checkPassword(password: string): boolean {
  return password === process.env.ACCESS_PASSWORD;
}
