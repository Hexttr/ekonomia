import { isAuthEnabled } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLogo } from "@/components/AppLogo";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ from?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  if (!isAuthEnabled()) redirect("/");

  const { from, error } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="mb-10 flex w-full max-w-sm flex-col items-center text-center">
        <AppLogo size="lg" className="mb-6" />
        <h1 className="font-brand text-3xl font-extrabold tracking-tight">
          <span className="text-[#ef4444]">Е</span>
          <span className="text-white">кономия</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">Введите семейный пароль</p>
        {error && <p className="mt-2 text-sm text-red-400">Неверный пароль</p>}
      </div>

      <form action="/api/auth/login" method="POST" className="w-full max-w-sm">
        <input type="hidden" name="from" value={from ?? "/"} />
        <label className="mb-4 block">
          <span className="sr-only">Пароль</span>
          <input
            type="password"
            name="password"
            className="input"
            placeholder="Пароль"
            required
            autoFocus
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          className="btn-primary flex w-full items-center justify-center gap-2.5 py-3"
        >
          <LogInIcon className="h-5 w-5 shrink-0" aria-hidden />
          Войти
        </button>
      </form>
    </div>
  );
}

function LogInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}
