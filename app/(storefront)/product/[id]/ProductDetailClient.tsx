"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, MessageCircle, Heart, Truck, Shield, Plus, Minus, Check } from "lucide-react";
import { formatPKR } from "@/lib/currency";
import { placeholderImage } from "@/lib/placeholders";
import { addToCartAction } from "@/lib/actions/cart";
import Image from "next/image";
import ProductCarousel from "@/components/store/ProductCarousel";
import { cn } from "@/lib/utils";

type Variant = {
  variantId: number;
  sku: string;
  variantName: string | null;
  price: string;
  stock: number;
};

export default function ProductDetailClient({
  product,
  relatedProducts,
  whatsappNumber,
}: {
  product: {
    productId: number;
    productName: string;
    productCode: string;
    basePrice: string;
    description: string | null;
    imageUrl: string | null;
    categoryName: string | null;
    variants: Variant[];
  };
  relatedProducts: any[];
  whatsappNumber?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Variant>(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const getProductImages = () => {
    const mainImg = product.imageUrl || placeholderImage(product.productId, product.productName, product.categoryName ?? "Boutique");
    
    const pools = ["/products/p1.png", "/products/p2.png", "/products/p3.png", "/products/p4.png"];
    const otherImg1 = pools[(product.productId + 1) % pools.length];
    const otherImg2 = pools[(product.productId + 2) % pools.length];
    
    return [mainImg, otherImg1, otherImg2];
  };

  const images = getProductImages();
  const imageSrc = images[activeDot] || images[0];
  const price = Number(selected?.price ?? product.basePrice);
  const inStock = (selected?.stock ?? 0) > 0;

  const onAdd = () => {
    if (!selected) return;
    startTransition(async () => {
      await addToCartAction({ variantId: selected.variantId, quantity: qty });
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    });
  };

  const onBuyWhatsApp = () => {
    if (!selected) return;
    const phone = whatsappNumber || "923398446658";
    const text = encodeURIComponent(
      `Hi! I'd like to order:\n\n*${product.productName}*${selected.variantName ? ` (${selected.variantName})` : ""}\nCode: ${product.productCode}\nPrice: ${formatPKR(price)}\nQty: ${qty}\n\nPlease confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  // Group variants by color (first word of variantName)
  const colors = Array.from(
    new Set(
      product.variants
        .map((v) => (v.variantName ?? "").split("/")[0]?.trim())
        .filter(Boolean)
    )
  );
  const sizes = Array.from(
    new Set(
      product.variants
        .map((v) => (v.variantName ?? "").split("/")[1]?.trim())
        .filter(Boolean)
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-ink/60 font-mono">
        <a href="/" className="hover:text-ink">Home</a>{" "}
        <span className="mx-2">/</span>{" "}
        <a href="/shop" className="hover:text-ink">Shop</a>{" "}
        {product.categoryName && (
          <>
            <span className="mx-2">/</span>
            <a href={`/shop/${slugify(product.categoryName)}`} className="hover:text-ink">
              {product.categoryName}
            </a>
          </>
        )}
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Sticky Image Column */}
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-paper-dark">
            <Image
              src={imageSrc}
              alt={product.productName}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
              priority
            />
          </div>
          {/* Dot indicators instead of 4 hardcoded thumbnails */}
          <div className="flex justify-center gap-2 pt-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  idx === activeDot ? "bg-ink w-4" : "bg-ink/20"
                )}
                onClick={() => setActiveDot(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:py-2">
          {product.categoryName && (
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">{product.categoryName}</p>
          )}
          <h1 className="mt-3 font-display text-display-md font-bold leading-tight">{product.productName}</h1>
          <p className="mt-2 text-xs font-mono text-ink/40">Code: {product.productCode}</p>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="font-mono text-2xl font-semibold text-ink">{formatPKR(price)}</p>
            {selected?.stock !== undefined && (
              <span className={cn(
                "text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded",
                inStock ? "bg-teal/10 text-teal" : "bg-maroon/10 text-maroon"
              )}>
                {inStock ? `In Stock (${selected.stock})` : "Out of Stock"}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-ink/70 font-sans">{product.description}</p>
          )}

          {/* Color selector - Slash separated editorial links */}
          {colors.length > 0 && (
            <div className="mt-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
                Color: <span className="text-ink font-semibold">{selected?.variantName?.split("/")[0]?.trim()}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
                {colors.map((c, idx) => {
                  const variant = product.variants.find((v) => (v.variantName ?? "").split("/")[0]?.trim() === c);
                  const isSelected = selected?.variantName?.split("/")[0]?.trim() === c;
                  return (
                    <span key={c} className="flex items-center">
                      <button
                        onClick={() => variant && setSelected(variant)}
                        className={cn(
                          "hover:text-ink transition-colors font-mono uppercase text-xs tracking-wider",
                          isSelected ? "text-ink font-bold underline underline-offset-4 decoration-maroon" : "text-ink/40"
                        )}
                      >
                        {c}
                      </button>
                      {idx < colors.length - 1 && <span className="text-ink/20 mx-2">/</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selector - Slash separated editorial links */}
          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
                Size: <span className="text-ink font-semibold">{selected?.variantName?.split("/")[1]?.trim() ?? "—"}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
                {sizes.map((s, idx) => {
                  const variant = product.variants.find((v) => (v.variantName ?? "").split("/")[1]?.trim() === s);
                  const isSelected = selected?.variantName?.split("/")[1]?.trim() === s;
                  return (
                    <span key={s} className="flex items-center">
                      <button
                        onClick={() => variant && setSelected(variant)}
                        className={cn(
                          "hover:text-ink transition-colors font-mono uppercase text-xs tracking-wider",
                          isSelected ? "text-ink font-bold underline underline-offset-4 decoration-maroon" : "text-ink/40"
                        )}
                      >
                        {s}
                      </button>
                      {idx < sizes.length - 1 && <span className="text-ink/20 mx-2">/</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-8 flex items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Quantity</p>
            <div className="flex items-center rounded-full border border-ink/10">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="rounded-l-full p-2 hover:bg-ink/5"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[3rem] text-center font-mono text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty(Math.min(99, qty + 1))}
                className="rounded-r-full p-2 hover:bg-ink/5"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onAdd}
              disabled={!inStock || pending}
              className="btn-primary flex-1"
            >
              {added ? (
                <><Check className="h-4 w-4" /> Added to Cart</>
              ) : pending ? (
                "Adding…"
              ) : (
                <><ShoppingBag className="h-4 w-4" /> Add to Cart</>
              )}
            </button>
            <button onClick={onBuyWhatsApp} className="btn-ghost flex-1">
              <MessageCircle className="h-4 w-4" /> Buy on WhatsApp
            </button>
          </div>
          <button className="mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink/50 hover:text-maroon">
            <Heart className="h-3 w-3" /> Save to Wishlist
          </button>

          {/* Trust signals */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-ink/10 pt-8 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-saffron shrink-0" />
              <div>
                <p className="font-semibold text-xs uppercase font-mono tracking-wider">Free shipping</p>
                <p className="text-xs text-ink/60">On orders over PKR 15,000</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-saffron shrink-0" />
              <div>
                <p className="font-semibold text-xs uppercase font-mono tracking-wider">Cash on Delivery</p>
                <p className="text-xs text-ink/60">Pay when you receive</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "You may also like" Product Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-ink/10 pt-16">
          <ProductCarousel
            title="You may also like"
            subtitle="Curated Recommendations"
            products={relatedProducts}
          />
        </div>
      )}
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
