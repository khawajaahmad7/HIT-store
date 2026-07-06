"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPKR } from "@/lib/currency";
import { placeholderImage } from "@/lib/placeholders";
import type { ProductCardData } from "@/components/store/ProductCard";

export default function EditCarousel({ products }: { products: ProductCardData[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-paper py-24 lg:py-32 border-t border-ink/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Curated Edit</p>
        <h2 className="mt-2 font-display text-display-xl font-bold text-ink">The Edit.</h2>
      </div>
      
      <div
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 lg:px-10 pb-8 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => {
          const src = p.imageUrl || placeholderImage(p.productId, p.productName, p.categoryName ?? "Edit");
          return (
            <div key={p.productId} className="w-[78vw] sm:w-[50vw] md:w-[35vw] lg:w-[26vw] shrink-0 snap-start group">
              <Link href={`/product/${p.productId}`} className="block overflow-hidden rounded-md bg-paper-dark aspect-[3/4.2] relative">
                <Image
                  src={src}
                  alt={p.productName}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 400px"
                  unoptimized
                />
              </Link>
              <div className="mt-4 flex justify-between items-start px-1">
                <div>
                  <h3 className="font-display text-base font-medium text-ink relative pb-0.5 group-hover:text-ink/80">
                    <span className="relative inline-block pb-0.5">
                      {p.productName}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-ink scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                    </span>
                  </h3>
                  <p className="mt-2 font-mono text-xs text-ink/70">
                    {formatPKR(p.basePrice)}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
                  {p.categoryName}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
