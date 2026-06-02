"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CategoryDTO, ExpenseDTO } from "@/lib/types";
import { deleteExpense, saveExpense } from "@/lib/actions/expenses";
import { today, toIsoDate } from "@/lib/dates";

type Props = {
  categories: CategoryDTO[];
  expense?: ExpenseDTO | null;
  onClose: () => void;
};

export function ExpenseDialog({ categories, expense, onClose }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [useCustomDate, setUseCustomDate] = useState(Boolean(expense));
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? categories[0]?.id ?? "");
  const [date, setDate] = useState(expense?.date ?? toIsoDate(today()));
  const [comment, setComment] = useState(expense?.comment ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(",", "."));
    if (!num || num <= 0) {
      setError("Укажите корректную сумму");
      return;
    }
    if (!categoryId) {
      setError("Сначала создайте категорию");
      return;
    }
    startTransition(async () => {
      try {
        await saveExpense({
          id: expense?.id,
          amount: num,
          categoryId,
          date: useCustomDate ? new Date(date) : today(),
          comment,
        });
        router.refresh();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка сохранения");
      }
    });
  };

  const handleDelete = () => {
    if (!expense || !confirm("Удалить расход?")) return;
    startTransition(async () => {
      await deleteExpense(expense.id);
      router.refresh();
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[92dvh] w-full max-w-[480px] overflow-y-auto rounded-t-2xl border border-white/10 bg-[#1c2129] p-4 sm:rounded-2xl"
      >
        <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-white/15" />
        <h2 className="mb-4 text-lg font-bold">{expense ? "Изменить расход" : "Новый расход"}</h2>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}

        <label className="mb-3 block">
          <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-500">Сумма, ₽</span>
          <input className="input" inputMode="decimal" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-500">Категория</span>
          <select className="select" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.length === 0 ? (
              <option value="">— нет категорий —</option>
            ) : (
              categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="mb-2 flex items-center gap-2">
          <input type="checkbox" checked={useCustomDate} onChange={(e) => setUseCustomDate(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
          <span className="text-sm text-gray-400">Указать дату</span>
        </label>

        {useCustomDate ? (
          <label className="mb-3 block">
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        ) : (
          <p className="mb-3 text-xs text-gray-500">Дата: сегодня</p>
        )}

        <label className="mb-4 block">
          <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-500">Комментарий</span>
          <textarea className="input min-h-[64px]" value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={pending}>
            Отмена
          </button>
          <button type="submit" className="btn-primary" disabled={pending || !categories.length}>
            Сохранить
          </button>
        </div>

        {expense && (
          <button type="button" className="mt-2 w-full py-2 text-sm text-red-400" onClick={handleDelete} disabled={pending}>
            Удалить расход
          </button>
        )}
      </form>
    </div>
  );
}
