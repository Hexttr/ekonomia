const REMEMBER_MAX_AGE_SEC = 60 * 60 * 24 * 365 * 10; // 10 лет

function secret(): string {
  return (
    process.env.SESSION_SECRET?.trim() ||
    process.env.ACCESS_PASSWORD?.trim() ||
    "ekonomiya-dev-secret"
  );
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToBase64Url(new Uint8Array(sig));
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createRememberToken(): Promise<string> {
  const exp = Date.now() + REMEMBER_MAX_AGE_SEC * 1000;
  const payload = String(exp);
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifyRememberToken(token: string): Promise<boolean> {
  const dot = token.lastIndexOf(".");
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await sign(payload);
  return signature === expected;
}

export { REMEMBER_MAX_AGE_SEC };
