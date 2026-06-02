"use client";

import { useEffect } from "react";
import { REMEMBER_COOKIE, REMEMBER_STORAGE_KEY } from "@/lib/auth-cookies";

/** Копирует долгоживущую cookie в localStorage (для PWA после входа). */
export function SessionSync() {
  useEffect(() => {
    const prefix = `${REMEMBER_COOKIE}=`;
    const row = document.cookie.split("; ").find((c) => c.startsWith(prefix));
    if (!row) return;
    const value = decodeURIComponent(row.slice(prefix.length));
    if (value) localStorage.setItem(REMEMBER_STORAGE_KEY, value);
  }, []);

  return null;
}
