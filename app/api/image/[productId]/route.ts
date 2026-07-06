import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { categoryGradient } from "@/lib/placeholders";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Dynamic SVG placeholder generator.
 * Returns a vibrant, category-tinted gradient with the product's first letter monogram.
 * Used because backup.sql has no product images.
 */
export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  const productId = Number(params.productId);
  const sp = req.nextUrl.searchParams;
  const overrideName = sp.get("name");
  const overrideCategory = sp.get("category");
  const size = (sp.get("size") ?? "800") as `${number}`;

  let name = overrideName ?? "HH";
  let categoryName = overrideCategory ?? "Boutique";

  if (!overrideName || !overrideCategory) {
    try {
      const rows = await db
        .select({
          productName: products.productName,
          categoryName: categories.categoryName,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.categoryId))
        .where(eq(products.productId, Number.isFinite(productId) ? productId : 0))
        .limit(1);
      if (rows[0]) {
        if (!overrideName) name = rows[0].productName;
        if (!overrideCategory && rows[0].categoryName) categoryName = rows[0].categoryName;
      }
    } catch {
      // ignore — DB not ready
    }
  }

  const gradient = categoryGradient(categoryName, productId);
  const monogram = (name || "H").trim().charAt(0).toUpperCase();
  const w = Number(size);
  const h = w;
  const cx = w / 2;
  const cy = h / 2;

  // Decorative pattern lines
  const lines: string[] = [];
  for (let i = 1; i < 6; i++) {
    const y = (h / 6) * i;
    lines.push(
      `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${gradient.accent}" stroke-opacity="0.08" stroke-width="1"/>`
    );
  }
  // Diagonal accents
  const accents: string[] = [];
  for (let i = 0; i < 4; i++) {
    accents.push(
      `<circle cx="${w * 0.85}" cy="${h * (0.15 + i * 0.25)}" r="${4 + (i % 2) * 2}" fill="${gradient.accent}" fill-opacity="${0.12 - i * 0.02}"/>`
    );
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${gradient.from}"/>
      <stop offset="100%" stop-color="${gradient.to}"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="40%" r="60%">
      <stop offset="60%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.25)"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>
  ${lines.join("")}
  ${accents.join("")}
  <g transform="translate(${cx}, ${cy})">
    <text text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, 'Times New Roman', serif" font-weight="700"
      font-size="${w * 0.45}" fill="${gradient.accent}" fill-opacity="0.92"
      style="font-feature-settings: 'liga'; letter-spacing: -0.05em;">${monogram}</text>
  </g>
  <g font-family="'Helvetica Neue', Arial, sans-serif" font-size="${Math.max(10, w * 0.025)}" fill="${gradient.accent}" fill-opacity="0.7" letter-spacing="2">
    <text x="${w * 0.06}" y="${h * 0.94}">${escapeXml(categoryName.toUpperCase())}</text>
    <text x="${w * 0.94}" y="${h * 0.94}" text-anchor="end">HIT BY HUMA</text>
  </g>
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
}
