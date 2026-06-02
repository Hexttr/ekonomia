"use client";

import { useState } from "react";
import type { CategoryDTO, ExpenseDTO } from "@/lib/types";
import { ExpenseDialog } from "./ExpenseDialog";
import { formatAmount, formatDate } from "@/lib/dates";
import { categoryInitials } from "@/lib/format";

type Props = {
  expenses: ExpenseDTO[];
  categories: CategoryDTO[];
  total: number;
};

export function ExpensesPageClient({ expenses, categories, total }: Props) {
  const [dialog, setDialog] = useState<"new" | string | null>(null);
  const editing = dialog && dialog !== "new" ? expenses.find((e) => e.id === dialog) : null;

  return (
    <>
      <div className="card-hero mb-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Итого за период
        </p>
        <p className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-400">
          {formatAmount(total)}
        </p>
      </div>

      {expenses.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">Расходов пока нет</p>
      ) : (
        <ul className="space-y-1.5">
          {expenses.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => setDialog(x.id)}
                className="card flex w-full overflow-hidden text-left active:opacity-90"
              >
                <div className="w-0.5 shrink-0" style={{ background: x.category.color }} />
                <div className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                    style={{ background: x.category.color }}
                  >
                    {categoryInitials(x.category.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight">{x.category.name}</p>
                    <p className="text-[11px] text-gray-500">{formatDate(new Date(x.date))}</p>
                    {x.comment && (
                      <p className="truncate text-[11px] text-gray-400">{x.comment}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-bold">{formatAmount(x.amount)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        aria-label="Добавить расход"
        onClick={() => setDialog("new")}
        className="fixed bottom-[calc(52px+12px+env(safe-area-inset-bottom))] right-[max(14px,calc(50%-232px))] z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-emerald-500 text-2xl font-light text-white shadow-fab"
      >
        +
      </button>

      {dialog && (
        <ExpenseDialog
          categories={categories}
          expense={dialog === "new" ? null : editing ?? null}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}
