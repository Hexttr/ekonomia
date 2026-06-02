import { Suspense } from "react";
import { FilterSection } from "@/components/FilterSection";
import { ExpensesPageClient } from "@/components/ExpensesPageClient";
import { getCategories } from "@/lib/actions/categories";
import { getExpensesFiltered } from "@/lib/actions/expenses";
import { parseCategoryId, parsePeriod } from "@/lib/search-params";
import { toCategoryDTO, toExpenseDTO } from "@/lib/serialize";

type Props = {
  searchParams: Promise<{ period?: string; category?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams;
  const period = parsePeriod(sp.period);
  const categoryId = parseCategoryId(sp.category);

  const [rawCategories, rawExpenses] = await Promise.all([
    getCategories(),
    getExpensesFiltered(period, categoryId),
  ]);

  const categories = rawCategories.map(toCategoryDTO);
  const expenses = rawExpenses.map(toExpenseDTO);
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <Suspense>
        <FilterSection categories={categories} period={period} categoryId={categoryId} />
      </Suspense>
      <ExpensesPageClient expenses={expenses} categories={categories} total={total} />
    </>
  );
}
