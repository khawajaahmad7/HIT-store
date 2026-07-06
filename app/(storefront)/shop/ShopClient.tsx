"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/store/ProductGrid";
import type { ProductCardData } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name", label: "Name (A–Z)" },
];

export default function ShopClient({
  initialProducts,
  categories,
  currentCategoryId,
}: {
  initialProducts: ProductCardData[];
  categories: { categoryId: number; categoryName: string; productCount: number }[];
  currentCategoryId?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [query, setQuery] = useState(sp.get("q") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "newest");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (sort && sort !== "newest") params.set("sort", sort);
      router.replace(`${pathname}${params.toString() ? "?" + params.toString() : ""}`, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [query, sort, router, pathname]);

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-10">
      {/* Editorial Header: "Shop" huge on the left, total products counts on the right */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-ink/10 pb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">The Collection</p>
          <h1 className="mt-2 font-display text-display-xl font-bold text-ink">Shop</h1>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-ink/50">
          {initialProducts.length === 0 ? "No items found" : `${initialProducts.length} items`}
        </div>
      </div>

      {/* Sticky Toolbar / Category Pill Bar */}
      <div className="sticky top-16 z-30 -mx-6 mb-10 bg-ivory/95 px-6 py-4 backdrop-blur-md border-b border-ink/10 lg:-mx-10 lg:px-10 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 w-full">
          {/* Horizontal scrollable category filter pills */}
          <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden flex gap-2" style={{ scrollbarWidth: "none" }}>
            <a
              href="/shop"
              className={cn(
                "px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-full transition-colors shrink-0",
                !currentCategoryId ? "bg-ink text-paper" : "bg-ink/5 text-ink hover:bg-ink/10"
              )}
            >
              All
            </a>
            {categories.map((c) => (
              <a
                key={c.categoryId}
                href={`/shop/${slugify(c.categoryName)}`}
                className={cn(
                  "px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-full transition-colors shrink-0 flex items-center gap-1.5",
                  currentCategoryId === c.categoryId ? "bg-ink text-paper" : "bg-ink/5 text-ink hover:bg-ink/10"
                )}
              >
                <span>{c.categoryName}</span>
                <span className="opacity-40 text-[9px] font-sans">({c.productCount})</span>
              </a>
            ))}
          </div>

          {/* Toggle buttons on mobile vs direct filters on desktop */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-ink/5 hover:bg-ink/10 rounded-full font-mono text-xs uppercase tracking-widest"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters drawer (collapsible on mobile, always visible or toggleable) */}
        <div className={cn(
          "md:flex md:items-center md:gap-4 md:opacity-100 md:max-h-none md:pointer-events-auto overflow-hidden transition-all duration-300",
          showFiltersMobile ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none md:max-h-none md:opacity-100"
        )}>
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px] mb-3 md:mb-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full border-b border-ink/20 bg-transparent pl-9 pr-8 py-2 text-sm focus:border-ink focus:outline-none font-mono text-ink"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort selection dropdown */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
            <span className="text-ink/40 shrink-0">Sort By</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-b border-ink/20 py-2 focus:border-ink focus:outline-none text-ink"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="text-ink bg-ivory">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid displaying the list of items */}
      <div className="w-full">
        {initialProducts.length === 0 ? (
          <div className="rounded-md border border-dashed border-ink/20 p-20 text-center bg-paper">
            <p className="font-display text-2xl font-semibold text-ink">No items match your criteria.</p>
            <p className="mt-2 text-ink/50 font-mono text-xs uppercase tracking-wider">Please refine your keyword search or category filters.</p>
          </div>
        ) : (
          <ProductGrid products={initialProducts} />
        )}
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
