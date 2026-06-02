"use client";

import { useEffect, useState } from "react";
import { REMEMBER_STORAGE_KEY } from "@/lib/auth-cookies";

type Props = { from: string };

/** Автовход по токену из localStorage (когда cookie сброшены в PWA). */
export function LoginRestore({ from }: Props) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(REMEMBER_STORAGE_KEY);
    if (!token) {
      setChecking(false);
      return;
    }

    const params = new URLSearchParams({ from });
    fetch(`/api/auth/restore?${params}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      redirect: "follow",
    })
      .then((res) => {
        if (res.ok || res.redirected) {
          window.location.href = res.url || from || "/";
          return;
        }
        localStorage.removeItem(REMEMBER_STORAGE_KEY);
        setChecking(false);
      })
      .catch(() => {
        setChecking(false);
      });
  }, [from]);

  if (!checking) return null;

  return (
    <p className="mb-4 text-center text-sm text-emerald-400/90">Входим…</p>
  );
}
