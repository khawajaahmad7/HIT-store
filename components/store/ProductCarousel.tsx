import ProductCard, { type ProductCardData } from "./ProductCard";
import StaggerReveal from "@/components/motion/StaggerReveal";
import TextReveal from "@/components/motion/TextReveal";

export default function ProductCarousel({
  title,
  subtitle,
  products,
  size = "md",
}: {
  title: string;
  subtitle?: string;
  products: ProductCardData[];
  size?: "sm" | "md" | "lg";
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      {(title || subtitle) && (
        <div className="mb-12">
          {subtitle && (
            <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
              {subtitle}
            </p>
          )}
          <h2 className="mt-2 font-display text-display-md font-bold text-ink">
            <TextReveal>{title}</TextReveal>
          </h2>
        </div>
      )}

      {/* Mobile: snap-scroll row; Tablet/Desktop: Grid layout */}
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-5 pb-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <div key={p.productId} className="w-[75vw] shrink-0 snap-start md:w-auto md:shrink">
            <ProductCard product={p} size={size} />
          </div>
        ))}
      </div>
    </section>
  );
}
