import { getCategories } from "@/lib/actions/categories";
import { CategoriesPageClient } from "@/components/CategoriesPageClient";
import { toCategoryDTO } from "@/lib/serialize";

export default async function CategoriesPage() {
  const categories = (await getCategories()).map(toCategoryDTO);
  return <CategoriesPageClient categories={categories} />;
}
