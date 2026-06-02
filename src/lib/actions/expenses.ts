"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import type { PeriodPreset } from "@/lib/constants";
import { getFilterRange } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export async function getExpensesFiltered(
  preset: PeriodPreset,
  categoryId?: string | null
) {
  const { from, to } = getFilterRange(preset);
  return prisma.expense.findMany({
    where: {
      date: { gte: from, lte: to },
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });
}

export async function getStatsByCategory(
  preset: PeriodPreset,
  categoryId?: string | null
) {
  const { from, to } = getFilterRange(preset);
  const expenses = await prisma.expense.groupBy({
    by: ["categoryId"],
    where: {
      date: { gte: from, lte: to },
      ...(categoryId ? { categoryId } : {}),
    },
    _sum: { amount: true },
  });

  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map((c) => [c.id, c]));

  return expenses
    .map((row) => {
      const cat = catMap.get(row.categoryId);
      if (!cat) return null;
      return {
        category: cat,
        total: Number(row._sum.amount ?? 0),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null && x.total > 0)
    .sort((a, b) => b.total - a.total);
}

export async function getExpense(id: string) {
  return prisma.expense.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function saveExpense(data: {
  id?: string;
  amount: number;
  categoryId: string;
  date: Date;
  comment?: string;
}) {
  if (!data.amount || data.amount <= 0) throw new Error("Укажите корректную сумму");

  const payload = {
    amount: new Prisma.Decimal(data.amount),
    categoryId: data.categoryId,
    date: data.date,
    comment: (data.comment ?? "").trim(),
  };

  if (data.id) {
    await prisma.expense.update({ where: { id: data.id }, data: payload });
  } else {
    await prisma.expense.create({ data: payload });
  }
  revalidatePath("/");
  revalidatePath("/stats");
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/stats");
}
