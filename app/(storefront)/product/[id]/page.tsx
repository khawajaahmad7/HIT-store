import { notFound } from "next/navigation";
import { getProductById, getFeaturedProducts } from "@/lib/db/queries/products";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return notFound();
  const product = await getProductById(id).catch(() => null);
  if (!product) return notFound();

  const relatedProducts = await getFeaturedProducts(4).catch(() => []);

  return (
    <ProductDetailClient
      product={product as any}
      relatedProducts={relatedProducts}
      whatsappNumber={process.env.WHATSAPP_NUMBER}
    />
  );
}
