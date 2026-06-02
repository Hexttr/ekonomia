import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[1] mx-auto flex min-h-dvh max-w-[480px] flex-col pb-[calc(52px+env(safe-area-inset-bottom)+56px)]">
      <Header />
      <main className="flex-1 px-3.5 py-1.5">{children}</main>
      <BottomNav />
    </div>
  );
}
