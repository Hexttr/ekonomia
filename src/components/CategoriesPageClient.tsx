"use client";

import { useState } from "react";
import type { CategoryDTO } from "@/lib/types";
import { CategoryDialog } from "./CategoryDialog";
import { CategoryIcon } from "./CategoryIcon";
import { deleteCategory } from "@/lib/actions/categories";
import { useRouter } from "next/navigation";

type Props = { categories: CategoryDTO[] };

export function CategoriesPageClient({ categories }: Props) {
  const router = useRouter();
  const [dialog, setDialog] = useState<"new" | string | null>(null);
  const editing = dialog && dialog !== "new" ? categories.find((c) => c.id === dialog) : null;

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить категорию?")) return;
    const r = await deleteCategory(id);
    if (!r.ok) alert("Нельзя удалить: есть расходы в этой категории");
    else router.refresh();
  };

  return (
    <>
      {categories.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">Добавьте категории</p>
      ) : (
        <ul className="space-y-1.5">
          {categories.map((c) => (
            <li key={c.id} className="card flex items-center gap-2.5 px-3 py-2.5">
              <CategoryIcon name={c.name} color={c.color} icon={c.icon} size="sm" />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{c.name}</span>
              <button type="button" className="rounded-lg p-2 text-gray-500" onClick={() => setDialog(c.id)}>
                ✎
              </button>
              <button type="button" className="rounded-lg p-2 text-red-400" onClick={() => handleDelete(c.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        aria-label="Добавить категорию"
        onClick={() => setDialog("new")}
        className="fixed bottom-[calc(52px+12px+env(safe-area-inset-bottom))] right-[max(14px,calc(50%-232px))] z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-emerald-500 text-2xl font-light text-white shadow-fab"
      >
        +
      </button>

      {dialog && <CategoryDialog category={dialog === "new" ? null : editing} onClose={() => setDialog(null)} />}
    </>
  );
}
