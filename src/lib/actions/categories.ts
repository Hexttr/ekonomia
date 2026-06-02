"use server";

import { revalidatePath } from "next/cache";
import { CATEGORY_ICON_IDS } from "@/lib/category-icons";
import { prisma } from "@/lib/prisma";

const VALID_ICONS = new Set<string>(CATEGORY_ICON_IDS);

function normalizeIcon(icon?: string | null): string {
  const id = icon?.trim() ?? "";
  return id && VALID_ICONS.has(id) ? id : "";
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function saveCategory(data: {
  id?: string;
  name: string;
  color: string;
  icon?: string | null;
}) {
  const name = data.name.trim();
  if (!name) throw new Error("Укажите название категории");
  const icon = normalizeIcon(data.icon);

  if (data.id) {
    await prisma.category.update({
      where: { id: data.id },
      data: { name, color: data.color, icon },
    });
  } else {
    await prisma.category.create({
      data: { name, color: data.color, icon },
    });
  }
  revalidatePath("/");
  revalidatePath("/stats");
  revalidatePath("/categories");
}

export async function deleteCategory(id: string) {
  const count = await prisma.expense.count({ where: { categoryId: id } });
  if (count > 0) {
    return { ok: false as const, reason: "has_expenses" as const };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/stats");
  revalidatePath("/categories");
  return { ok: true as const };
}
