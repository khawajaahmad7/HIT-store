import Hero from "@/components/store/Hero";
import CategoryEditorial from "@/components/store/CategoryEditorial";
import ProductGrid from "@/components/store/ProductGrid";
import MarqueeStrip from "@/components/store/MarqueeStrip";
import StorySticky from "@/components/store/StorySticky";
import NumbersBlock from "@/components/store/NumbersBlock";
import EditCarousel from "@/components/store/EditCarousel";
import PoetryBlock from "@/components/store/PoetryBlock";
import { Sparkles, Truck, MessageCircle, Shield } from "lucide-react";
import { getCategoriesWithCounts, getNewArrivals, getBestSellers } from "@/lib/db/queries/products";

export const revalidate = 300;

export default async function HomePage() {
  // Load data with fallback so build doesn't fail without DB
  let categories: Awaited<ReturnType<typeof getCategoriesWithCounts>> = [];
  let newArrivals: Awaited<ReturnType<typeof getNewArrivals>> = [];
  let bestSellers: Awaited<ReturnType<typeof getBestSellers>> = [];
  try {
    [categories, newArrivals, bestSellers] = await Promise.all([
      getCategoriesWithCounts(),
      getNewArrivals(8),
      getBestSellers(4),
    ]);
  } catch (err) {
    console.warn("[/] DB not ready, rendering empty state:", err);
  }

  return (
    <>
      <Hero />

      {/* Features strip */}
      <section className="border-y border-ink/10 bg-ivory">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4 lg:px-10">
          {[
            { icon: Truck, title: "Free Shipping", body: "On orders over PKR 15,000" },
            { icon: Shield, title: "Authentic", body: "100% genuine fabrics" },
            { icon: MessageCircle, title: "WhatsApp", body: "Order via chat" },
            { icon: Sparkles, title: "Hand-picked", body: "Curated collection" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="rounded-full bg-maroon/10 p-3 text-maroon">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-xs text-ink/60">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 1. Marquee strip */}
      <MarqueeStrip />

      {/* 2. Category editorial */}
      <CategoryEditorial
        items={categories.slice(0, 9).map((c) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName,
          productCount: Number(c.productCount ?? 0),
        }))}
      />

      {/* 2.5. Poetic Quote / Calligraphy couplet */}
      <PoetryBlock />

      {/* 3. Story section with StickySection */}
      <StorySticky />

      {/* 4. The Edit — snap-scroll product strip */}
      {newArrivals.length > 0 && (
        <EditCarousel products={newArrivals.map((n) => ({
          productId: n.productId,
          productName: n.productName,
          productCode: n.productCode,
          basePrice: n.basePrice,
          imageUrl: n.imageUrl,
          categoryName: n.categoryName,
        }))} />
      )}

      {/* 5. Best Sellers */}
      {bestSellers.length > 0 && (
        <ProductGrid title="Best Sellers" subtitle="Most Loved" products={bestSellers} size="lg" />
      )}

      {/* 6. By the numbers */}
      <NumbersBlock />

      {/* 7. Newsletter — thin band */}
      <section className="border-t border-b border-ink/10 bg-paper py-20 text-ink">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-display text-display-md font-bold text-ink">
              Stay in the loop.
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ink/50">
              Subscribe for early access & collection updates.
            </p>
          </div>
          <form className="flex w-full max-w-md border-b border-ink/30 py-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-transparent px-2 py-1 text-sm text-ink placeholder:text-ink/30 focus:outline-none"
            />
            <button type="submit" className="font-display italic text-maroon hover:text-ink tracking-wider font-semibold text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
