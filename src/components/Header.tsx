import { AppLogo } from "./AppLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#0f1114]/95 px-4 pb-2.5 pt-[max(8px,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <AppLogo size="sm" className="ring-offset-1" />
        <div className="min-w-0 flex-1">
          <h1 className="font-brand text-[1.35rem] font-extrabold leading-tight tracking-tight">
            <span className="text-[#ef4444]">Е</span>
            <span className="text-white">кономия</span>
          </h1>
          <p className="truncate text-[11px] font-medium tracking-wide text-emerald-500/80">
            хватит тратить бабки
          </p>
        </div>
      </div>
    </header>
  );
}
