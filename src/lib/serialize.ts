import type { Category, Expense } from "@prisma/client";
import type { CategoryDTO, ExpenseDTO } from "./types";
import { decimalToNumber } from "./format";
import { toIsoDate } from "./dates";

export function toCategoryDTO(c: Category): CategoryDTO {
  return { id: c.id, name: c.name, color: c.color };
}

export function toExpenseDTO(
  e: Expense & { category: Category }
): ExpenseDTO {
  return {
    id: e.id,
    amount: decimalToNumber(e.amount),
    date: toIsoDate(new Date(e.date)),
    comment: e.comment,
    categoryId: e.categoryId,
    category: toCategoryDTO(e.category),
  };
}
