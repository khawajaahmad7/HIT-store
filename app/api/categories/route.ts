import { NextResponse } from "next/server";
import { getCategoriesWithCounts } from "@/lib/db/queries/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getCategoriesWithCounts();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[/api/categories]", err);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
