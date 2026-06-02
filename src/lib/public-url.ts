import type { NextRequest } from "next/server";

/** Публичный origin за nginx (не 0.0.0.0:3000 внутри Docker). */
export function getPublicOrigin(request: Request | NextRequest): string {
  const fromEnv = process.env.APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const h = request.headers;
  const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "http";
  const host = h.get("x-forwarded-host")?.split(",")[0]?.trim() ?? h.get("host");

  if (host && !isInternalHost(host)) {
    return `${proto}://${host}`;
  }

  return "http://178.170.165.78";
}

function isInternalHost(host: string): boolean {
  return (
    host.startsWith("0.0.0.0") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("localhost") ||
    host.endsWith(":3000")
  );
}

export function publicUrl(request: Request | NextRequest, path: string): URL {
  return new URL(path.startsWith("/") ? path : `/${path}`, getPublicOrigin(request));
}
