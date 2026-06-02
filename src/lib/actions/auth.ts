"use server";

import { redirect } from "next/navigation";
import { checkPassword, setAuthenticated } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");
  const safeFrom = from.startsWith("/") ? from : "/";

  if (!checkPassword(password)) {
    redirect(`/login?error=1&from=${encodeURIComponent(safeFrom)}`);
  }
  await setAuthenticated();
  redirect(safeFrom);
}
