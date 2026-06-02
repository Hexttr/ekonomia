"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { PERIOD_OPTIONS, type PeriodPreset } from "@/lib/constants";
import { formatPeriodLabel } from "@/lib/dates";
import type { CategoryDTO } from "@/lib/types";

type Props = {
  categories: CategoryDTO[];
  period: PeriodPreset;
  categoryId: string | null;
};

export function FilterSection({ categories, period, categoryId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams]
  );

  const periodInfo = formatPeriodLabel(period);

  return (
    <section className="mb-2.5 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="space-y-1">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            <CalendarIcon className="h-3 w-3 text-emerald-500/90" />
            Период
          </span>
          <select
            className="select"
            value={period}
            onChange={(e) => updateParams("period", e.target.value)}
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            <TagIcon className="h-3 w-3 text-emerald-500/90" />
            Категория
          </span>
          <select
            className="select"
            value={categoryId ?? ""}
            onChange={(e) => updateParams("category", e.target.value || null)}
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-[#1c2129]/80 px-3 py-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
          <ClockIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold capitalize leading-tight text-gray-100">
            {periodInfo.title}
          </p>
          <p className="truncate text-[11px] text-gray-500">{periodInfo.range}</p>
        </div>
      </div>
    </section>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
