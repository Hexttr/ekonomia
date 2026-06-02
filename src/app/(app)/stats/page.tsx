import { Suspense } from "react";
import { FilterSection } from "@/components/FilterSection";
import { StatsPageClient } from "@/components/StatsPageClient";
import { getCategories } from "@/lib/actions/categories";
import { getStatsByCategory } from "@/lib/actions/expenses";
import { parseCategoryId, parsePeriod } from "@/lib/search-params";
import { toCategoryDTO } from "@/lib/serialize";

type Props = {
  searchParams: Promise<{ period?: string; category?: string }>;
};

export default async function StatsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const period = parsePeriod(sp.period);
  const categoryId = parseCategoryId(sp.category);

  const [rawCategories, rawRows] = await Promise.all([
    getCategories(),
    getStatsByCategory(period, categoryId),
  ]);

  const categories = rawCategories.map(toCategoryDTO);
  const rows = rawRows.map((r) => ({
    category: toCategoryDTO(r.category),
    total: r.total,
  }));
  const total = rows.reduce((s, r) => s + r.total, 0);

  return (
    <>
      <Suspense>
        <FilterSection categories={categories} period={period} categoryId={categoryId} />
      </Suspense>
      <StatsPageClient rows={rows} total={total} />
    </>
  );
}
