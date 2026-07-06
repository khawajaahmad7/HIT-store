import ProductCard, { type ProductCardData } from "./ProductCard";
import StaggerReveal from "@/components/motion/StaggerReveal";
import TextReveal from "@/components/motion/TextReveal";

export default function ProductGrid({
  title,
  subtitle,
  products,
  size = "md",
}: {
  title?: string;
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
          {title && (
            <h2 className="mt-2 font-display text-display-md font-bold text-ink">
              <TextReveal>{title}</TextReveal>
            </h2>
          )}
        </div>
      )}
      
      {/* Refined gap for a tighter grid layout */}
      <StaggerReveal
        className="grid grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
        staggerChildren={0.06}
        y={20}
      >
        {products.map((p) => (
          <div key={p.productId} className="h-full">
            <ProductCard product={p} size={size} />
          </div>
        ))}
      </StaggerReveal>
    </section>
  );
}
