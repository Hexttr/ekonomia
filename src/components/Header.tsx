import { AppLogo } from "./AppLogo";

function headerNow() {
  const now = new Date();
  const month = now.toLocaleDateString("ru-RU", { month: "long" });
  const year = now.getFullYear();
  const day = now.getDate();
  const weekday = now.toLocaleDateString("ru-RU", { weekday: "short" });
  return { month, year, day, weekday };
}

export function Header() {
  const { month, year, day, weekday } = headerNow();

  return (
    <header className="sticky top-0 z-10 w-full pt-[max(10px,env(safe-area-inset-top))]">
      <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-[#1a1f28] via-[#12151a] to-[#0f1114] px-4 pb-4 pt-2">
        <div
          className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent"
          aria-hidden
        />

        <div className="relative flex w-full items-stretch justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <AppLogo size="sm" />
            <div className="min-w-0">
              <h1 className="font-brand text-[1.5rem] font-extrabold leading-none tracking-tight">
                <span className="text-[#ef4444]">Е</span>
                <span className="text-white">кономия</span>
              </h1>
              <p className="mt-1.5 text-[11px] font-medium leading-snug text-gray-400">
                хватит тратить бабки
              </p>
            </div>
          </div>

          <aside className="flex shrink-0 flex-col items-end justify-center">
            <div className="flex flex-col items-end rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 shadow-inner backdrop-blur-sm">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/90">
                {weekday}
              </span>
              <span className="mt-0.5 text-2xl font-extrabold leading-none tabular-nums text-white">
                {day}
              </span>
              <span className="mt-1 text-right text-[11px] font-medium capitalize leading-tight text-gray-400">
                {month}
                <span className="text-gray-500"> · </span>
                {year}
              </span>
            </div>
            <span className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              семейный учёт
            </span>
          </aside>
        </div>
      </div>
    </header>
  );
}
