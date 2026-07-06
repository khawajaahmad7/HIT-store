"use client";

import Link from "next/link";
import Image from "next/image";
import Marquee from "@/components/motion/Marquee";
import { categoryImage } from "@/lib/placeholders";

export type CategoryEditorialItem = {
  categoryId: number;
  categoryName: string;
  productCount: number;
};

function EditorialCard({ c }: { c: CategoryEditorialItem }) {
  return (
    <div className="w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[32vw] shrink-0 snap-start group relative">
      <Link href={`/shop/${slugify(c.categoryName)}`} className="block">
        <div className="relative aspect-[3/4.5] overflow-hidden rounded-md bg-paper-dark shadow-sm">
          <Image
            src={categoryImage(c.categoryName).src}
            alt={c.categoryName}
            fill
            sizes="(max-width: 768px) 80vw, 400px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            unoptimized
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/25 transition-colors duration-500" />
          
          {/* Vertical label inside */}
          <div className="absolute left-4 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-paper [writing-mode:vertical-lr] rotate-180 opacity-80">
            {c.productCount} pieces
          </div>
          
          {/* Category name set huge inside card (bottom left) */}
          <div className="absolute bottom-6 left-6 right-6 text-paper">
            <h3 className="font-display text-display-lg font-bold leading-none select-none">
              {c.categoryName}
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CategoryEditorial({ items }: { items: CategoryEditorialItem[] }) {
  if (items.length === 0) return null;
  const categoriesList = items.map((c) => c.categoryName);

  return (
    <section className="bg-paper py-24 lg:py-32 border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-12 flex justify-between items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Collections</p>
          <h2 className="mt-2 font-display text-display-xl font-bold text-ink">Shop by Category.</h2>
        </div>
        <Link href="/shop" className="font-display italic text-base text-ink hover:text-maroon underline">
          View All
        </Link>
      </div>

      {/* Horizontal snap scroll row */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 lg:px-10 pb-8 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        {items.map((c) => (
          <EditorialCard key={c.categoryId} c={c} />
        ))}
      </div>

      {/* Marquee strip below: a single line of all category names in serif, slowly moving, repeated. */}
      <div className="mt-8 border-y border-ink/10 py-6 bg-paper">
        <Marquee
          items={categoriesList}
          speed={60}
          className="text-ink"
          itemClassName="font-display uppercase tracking-widest text-ink/75 text-3xl md:text-4xl italic"
        />
      </div>
    </section>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
