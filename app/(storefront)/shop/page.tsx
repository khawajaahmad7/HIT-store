import { getProducts, getCategoriesWithCounts } from "@/lib/db/queries/products";
import ShopClient from "./ShopClient";

export const revalidate = 60;

export default async function ShopPage({ searchParams }: { searchParams: { q?: string; sort?: string; categoryId?: string } }) {
  const [products, categories] = await Promise.all([
    getProducts({
      q: searchParams.q,
      sort: (searchParams.sort as any) ?? "newest",
      categoryId: searchParams.categoryId ? Number(searchParams.categoryId) : undefined,
      limit: 96,
    }).catch(() => []),
    getCategoriesWithCounts().catch(() => []),
  ]);

  return (
    <ShopClient
      initialProducts={products as any}
      categories={categories.map(c => ({
        categoryId: c.categoryId,
        categoryName: c.categoryName,
        productCount: Number(c.productCount ?? 0),
      }))}
    />
  );
}
