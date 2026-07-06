import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/db/queries/products";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[/api/products/[id]]", err);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}
