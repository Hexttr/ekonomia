import { AppLogo } from "./AppLogo";

function headerNow() {
  const now = new Date();
  const weekdayRaw = now.toLocaleDateString("ru-RU", { weekday: "long" });
  const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);
  const month = now.toLocaleDateString("ru-RU", { month: "long" });
  const dayMonth = `${now.getDate()} ${month}`;
  const year = `${now.getFullYear()}г.`;
  return { weekday, dayMonth, year };
}

export function Header() {
  const { weekday, dayMonth, year } = headerNow();

  return (
    <header className="sticky top-0 z-10 w-full pt-[max(8px,env(safe-area-inset-top))]">
      <div className="relative border-b border-white/[0.08] bg-gradient-to-br from-[#1a1f28] via-[#12151a] to-[#0f1114] px-3.5 py-2.5">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
          aria-hidden
        />

        <div className="relative flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <AppLogo size="sm" className="!h-10 !w-10 rounded-xl" />
            <div className="min-w-0">
              <h1 className="font-brand text-[1.3rem] font-extrabold leading-none tracking-tight">
                <span className="text-[#ef4444]">Е</span>
                <span className="text-white">кономия</span>
              </h1>
              <p className="mt-1 text-[10px] font-medium leading-tight text-gray-500">
                хватит тратить бабки
              </p>
            </div>
          </div>

          <aside className="shrink-0 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-right leading-tight">
            <p className="text-[11px] font-medium text-emerald-400/95">{weekday}</p>
            <p className="mt-0.5 text-sm font-bold capitalize text-white">{dayMonth}</p>
            <p className="mt-0.5 text-[10px] font-medium text-gray-500">{year}</p>
          </aside>
        </div>
      </div>
    </header>
  );
}
