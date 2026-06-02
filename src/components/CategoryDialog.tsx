"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CategoryDTO } from "@/lib/types";
import { COLOR_PALETTE } from "@/lib/constants";
import { CATEGORY_ICON_MAP, CATEGORY_ICON_OPTIONS, isCategoryIconId } from "@/lib/category-icons";
import { deleteCategory, saveCategory } from "@/lib/actions/categories";
import { CategoryIcon } from "./CategoryIcon";
import { cn } from "@/lib/cn";

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
  const [icon, setIcon] = useState<string | null>(category?.icon ?? null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await saveCategory({ id: category?.id, name, color, icon });
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

  const isNew = !category;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[92dvh] w-full max-w-[480px] overflow-y-auto rounded-t-2xl border border-white/10 bg-[#1c2129] p-4 sm:rounded-2xl"
      >
        <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-white/15" />
        <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
          {isNew ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <TagPlusIcon className="h-5 w-5" />
            </span>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400">
              <PencilIcon className="h-5 w-5" />
            </span>
          )}
          {isNew ? "Новая категория" : "Изменить категорию"}
        </h2>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}

        <label className="mb-3 block">
          <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-500">Название</span>
          <input className="input" required maxLength={64} value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <fieldset className="mb-3">
          <legend className="mb-2 text-[10px] font-semibold uppercase text-gray-500">Иконка</legend>
          <div className="mb-2 flex items-center gap-2">
            <CategoryIcon name={name || "—"} color={color} icon={icon} size="md" />
            <span className="text-xs text-gray-500">
              {icon && isCategoryIconId(icon) ? CATEGORY_ICON_MAP[icon].label : "Буквы, если иконка не выбрана"}
            </span>
          </div>
          <div className="grid max-h-36 grid-cols-6 gap-1.5 overflow-y-auto rounded-xl border border-white/10 bg-[#0f1114] p-2">
            <button
              type="button"
              title="Без иконки"
              onClick={() => setIcon(null)}
              className={cn(
                "flex h-10 items-center justify-center rounded-lg border text-[10px] font-semibold text-gray-500",
                icon === null ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10"
              )}
            >
              Аа
            </button>
            {CATEGORY_ICON_OPTIONS.map(({ id, label }) => {
              const { Icon } = CATEGORY_ICON_MAP[id];
              return (
                <button
                  key={id}
                  type="button"
                  title={label}
                  onClick={() => setIcon(id)}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-lg border text-gray-300",
                    icon === id ? "border-emerald-500 bg-emerald-500/15 text-emerald-300" : "border-white/10 bg-[#1c2129]"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mb-4">
          <legend className="mb-2 text-[10px] font-semibold uppercase text-gray-500">Цвет</legend>
          <div className="grid grid-cols-8 gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                className={cn(
                  "aspect-square w-full max-w-[2.25rem] rounded-full border-2 justify-self-center",
                  color === c ? "border-white scale-110" : "border-transparent"
                )}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost flex items-center gap-2" onClick={onClose} disabled={pending}>
            <XIcon className="h-4 w-4" aria-hidden />
            Отмена
          </button>
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={pending}>
            <CheckIcon className="h-4 w-4" aria-hidden />
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

function TagPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <path d="M12 8v6M9 11h6" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
