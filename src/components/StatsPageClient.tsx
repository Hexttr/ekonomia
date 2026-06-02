"use client";

import { useState } from "react";
import type { CategoryDTO } from "@/lib/types";
import { formatAmount } from "@/lib/dates";

type Row = { category: CategoryDTO; total: number };

type Props = {
  rows: Row[];
  total: number;
};

export function StatsPageClient({ rows, total }: Props) {
  const [view, setView] = useState<"list" | "chart">("list");

  const gradient =
    rows.length && total > 0
      ? (() => {
          let acc = 0;
          const stops = rows.map((r) => {
            const pct = (r.total / total) * 100;
            const start = acc;
            acc += pct;
            return `${r.category.color} ${start}% ${acc}%`;
          });
          return `conic-gradient(from -90deg, ${stops.join(", ")})`;
        })()
      : "conic-gradient(#333 0deg 360deg)";

  return (
    <>
      <div className="card-hero mb-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Всего за период</p>
        <p className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-400">{formatAmount(total)}</p>
      </div>

      {rows.length > 0 && (
        <div className="mb-2 flex gap-1 rounded-xl border border-white/10 bg-[#0f1114] p-0.5">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`flex flex-1 items-center justify-center rounded-lg py-2 text-xs font-semibold ${
              view === "list" ? "bg-[#1c2129] text-emerald-400" : "text-gray-500"
            }`}
          >
            Список
          </button>
          <button
            type="button"
            onClick={() => setView("chart")}
            className={`flex flex-1 items-center justify-center rounded-lg py-2 text-xs font-semibold ${
              view === "chart" ? "bg-[#1c2129] text-emerald-400" : "text-gray-500"
            }`}
          >
            Диаграмма
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">Нет данных за период</p>
      ) : view === "chart" ? (
        <div className="card p-4">
          <div
            className="mx-auto mb-4 aspect-square w-[min(200px,65vw)] rounded-full"
            style={{ background: gradient }}
          >
            <div className="flex h-full w-full items-center justify-center p-[21%]">
              <div className="flex aspect-square w-full flex-col items-center justify-center rounded-full border border-white/10 bg-[#1c2129] text-center">
                <span className="text-[10px] font-semibold uppercase text-gray-500">Всего</span>
                <span className="text-base font-extrabold text-emerald-400">{formatAmount(total)}</span>
              </div>
            </div>
          </div>
          <ul className="space-y-1.5">
            {rows.map((r) => {
              const pct = total > 0 ? Math.round((r.total / total) * 100) : 0;
              return (
                <li
                  key={r.category.id}
                  className="grid grid-cols-[10px_1fr_auto] items-center gap-2 rounded-lg border border-white/10 bg-[#0f1114] px-2.5 py-2"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.category.color }} />
                  <span className="truncate text-sm font-semibold">{r.category.name}</span>
                  <span className="text-right text-sm font-bold">
                    {formatAmount(r.total)}
                    <span className="ml-1 text-[11px] font-normal text-gray-500">{pct}%</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {rows.map((r) => {
            const pct = total > 0 ? Math.round((r.total / total) * 100) : 0;
            return (
              <li key={r.category.id} className="card px-3 py-2.5">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.category.color }} />
                    {r.category.name}
                  </span>
                  <span className="font-bold">{formatAmount(r.total)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#0f1114]">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: r.category.color }} />
                </div>
                <p className="mt-1 text-[11px] text-gray-500">{pct}%</p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
