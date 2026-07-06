import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db/queries/products";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filter = {
    categoryId: sp.get("categoryId") ? Number(sp.get("categoryId")) : undefined,
    colorHex: sp.get("color") ?? undefined,
    sizeId: sp.get("sizeId") ? Number(sp.get("sizeId")) : undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    q: sp.get("q") ?? undefined,
    sort: (sp.get("sort") as any) ?? undefined,
    limit: sp.get("limit") ? Number(sp.get("limit")) : 24,
    offset: sp.get("offset") ? Number(sp.get("offset")) : 0,
  };

  try {
    const items = await getProducts(filter);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[/api/products]", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
