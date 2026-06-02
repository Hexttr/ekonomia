"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CategoryDTO } from "@/lib/types";
import { COLOR_PALETTE } from "@/lib/constants";
import { deleteCategory, saveCategory } from "@/lib/actions/categories";

type Props = {
  category?: CategoryDTO | null;
  onClose: () => void;
};

export function CategoryDialog({ category, onClose }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [name, setName] = useState(category?.name ?? "");
  const [color, setColor] = useState(category?.color ?? COLOR_PALETTE[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await saveCategory({ id: category?.id, name, color });
        router.refresh();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  const handleDelete = () => {
    if (!category || !confirm("Удалить категорию?")) return;
    startTransition(async () => {
      const r = await deleteCategory(category.id);
      if (!r.ok) setError("Нельзя удалить: есть расходы");
      else {
        router.refresh();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-[480px] rounded-t-2xl border border-white/10 bg-[#1c2129] p-4 sm:rounded-2xl">
        <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-white/15" />
        <h2 className="mb-4 text-lg font-bold">{category ? "Изменить категорию" : "Новая категория"}</h2>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}

        <label className="mb-3 block">
          <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-500">Название</span>
          <input className="input" required maxLength={64} value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <fieldset className="mb-4">
          <legend className="mb-2 text-[10px] font-semibold uppercase text-gray-500">Цвет</legend>
          <div className="flex flex-wrap gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                className={`h-9 w-9 rounded-full border-2 ${color === c ? "border-white" : "border-transparent"}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn-primary" disabled={pending}>
            Сохранить
          </button>
        </div>

        {category && (
          <button type="button" className="mt-2 w-full py-2 text-sm text-red-400" onClick={handleDelete} disabled={pending}>
            Удалить категорию
          </button>
        )}
      </form>
    </div>
  );
}
