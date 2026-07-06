import Link from "next/link";
import Image from "next/image";
import { formatPKR } from "@/lib/currency";
import { placeholderImage } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

export type ProductCardData = {
  productId: number;
  productName: string;
  productCode: string;
  basePrice: string | number;
  imageUrl?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  variantLabel?: string | null;
};

export default function ProductCard({
  product,
  size = "md",
  showCategory = true,
  priority = false,
}: {
  product: ProductCardData;
  size?: "sm" | "md" | "lg";
  showCategory?: boolean;
  priority?: boolean;
}) {
  const src = product.imageUrl || placeholderImage(product.productId, product.productName, product.categoryName ?? "Boutique");

  return (
    <Link
      href={`/product/${product.productId}`}
      className="group block overflow-hidden rounded-md bg-transparent"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-paper-dark rounded-md",
          size === "sm" && "aspect-square",
          size === "md" && "aspect-[3/4]",
          size === "lg" && "aspect-[3/4]"
        )}
      >
        <Image
          src={src}
          alt={product.productName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized
          priority={priority}
        />
      </div>
      <div className="pt-4 pb-2 px-1">
        {showCategory && product.categoryName && (
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">{product.categoryName}</p>
        )}
        <div className="mt-1 flex items-start justify-between gap-4">
          <h3
            className={cn(
              "font-display font-medium text-ink relative pb-0.5 group-hover:text-ink/80",
              size === "lg" ? "text-xl" : "text-base"
            )}
          >
            <span className="relative inline-block pb-0.5">
              {product.productName}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-ink scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
          </h3>
          <span className="text-sm transition-transform duration-300 ease-out group-hover:translate-x-1 shrink-0">→</span>
        </div>
        {product.variantLabel && (
          <p className="mt-1 font-mono text-[10px] text-ink/40">{product.variantLabel}</p>
        )}
        <p className="mt-2 font-mono text-xs text-ink/70">
          {formatPKR(product.basePrice)}
        </p>
      </div>
    </Link>
  );
}
