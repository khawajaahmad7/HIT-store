import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoriesWithCounts, getProducts } from "@/lib/db/queries/products";
import ShopClient from "../ShopClient";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const [catRows, categories] = await Promise.all([
    getCategoryBySlug(slug).catch((err) => {
      console.error("DB error in getCategoryBySlug:", err);
      return [];
    }),
    getCategoriesWithCounts().catch((err) => {
      console.error("DB error in getCategoriesWithCounts:", err);
      return [];
    }),
  ]);
  const cat = catRows?.[0];
  if (!cat) {
    // fallback: try matching by lowercase name in any
    return notFound();
  }

  const products = await getProducts({ categoryId: cat.categoryId, limit: 96 }).catch(() => []);

  return (
    <ShopClient
      initialProducts={products as any}
      categories={categories.map(c => ({
        categoryId: c.categoryId,
        categoryName: c.categoryName,
        productCount: Number(c.productCount ?? 0),
      }))}
      currentCategoryId={cat.categoryId}
    />
  );
}
