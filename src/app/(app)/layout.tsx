import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-gray-500">Загрузка…</p>}>{children}</Suspense>
    </AppShell>
  );
}
