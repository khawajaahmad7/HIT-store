import { db } from "@/lib/db";
import { categories, products, productVariants, skuColors, skuSizes, inventory, settings, locations } from "@/lib/db/schema";
import { and, asc, desc, eq, gte, lte, like, sql, inArray, or } from "drizzle-orm";

export type ProductFilter = {
  categoryId?: number;
  categorySlug?: string;
  colorHex?: string;
  sizeId?: number;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name";
  limit?: number;
  offset?: number;
};

export async function getCategoriesWithCounts() {
  return db
    .select({
      categoryId: categories.categoryId,
      categoryName: categories.categoryName,
      categoryCode: categories.categoryCode,
      sortOrder: categories.sortOrder,
      productCount: sql<number>`COUNT(${products.productId})`.as("product_count"),
    })
    .from(categories)
    .leftJoin(products, and(eq(products.categoryId, categories.categoryId), eq(products.isActive, 1)))
    .where(eq(categories.isActive, 1))
    .groupBy(categories.categoryId)
    .orderBy(asc(categories.sortOrder), asc(categories.categoryName));
}

export async function getCategoryBySlug(slug: string) {
  const allCategories = await db.select().from(categories);
  const target = slug.toLowerCase();
  
  const matched = allCategories.find((c) => {
    // 1. Match code (e.g. VDS, JNS, LWN)
    if (c.categoryCode && c.categoryCode.toLowerCase() === target) {
      return true;
    }
    
    // 2. Slugify the category name and compare exactly
    const catSlug = c.categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    if (catSlug === target) {
      return true;
    }
    
    // 3. Fallback: loose comparison (if target is substring of slug or vice-versa)
    const cleanTarget = target.replace(/[^a-z0-9]/g, "");
    const cleanSlug = catSlug.replace(/[^a-z0-9]/g, "");
    if (cleanTarget && cleanSlug && (cleanSlug.includes(cleanTarget) || cleanTarget.includes(cleanSlug))) {
      return true;
    }
    
    return false;
  });
  
  return matched ? [matched] : [];
}

export async function getFeaturedProducts(limit = 12) {
  return db
    .select({
      productId: products.productId,
      productName: products.productName,
      productCode: products.productCode,
      basePrice: products.basePrice,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      categoryName: categories.categoryName,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.categoryId))
    .where(eq(products.isActive, 1))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getNewArrivals(limit = 8) {
  return getFeaturedProducts(limit);
}

export async function getBestSellers(limit = 4) {
  // No sales aggregation in the public view; use a curated pick of highest-priced items
  return db
    .select({
      productId: products.productId,
      productName: products.productName,
      productCode: products.productCode,
      basePrice: products.basePrice,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      categoryName: categories.categoryName,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.categoryId))
    .where(eq(products.isActive, 1))
    .orderBy(desc(products.basePrice))
    .limit(limit);
}

export async function getProducts(filter: ProductFilter = {}) {
  const conds = [eq(products.isActive, 1)];

  if (filter.categoryId) conds.push(eq(products.categoryId, filter.categoryId));
  if (filter.minPrice != null) conds.push(gte(products.basePrice, String(filter.minPrice)));
  if (filter.maxPrice != null) conds.push(lte(products.basePrice, String(filter.maxPrice)));
  if (filter.q) {
    const q = `%${filter.q}%`;
    conds.push(or(like(products.productName, q), like(products.productCode, q))!);
  }

  let order;
  switch (filter.sort) {
    case "price-asc":
      order = asc(products.basePrice);
      break;
    case "price-desc":
      order = desc(products.basePrice);
      break;
    case "name":
      order = asc(products.productName);
      break;
    default:
      order = desc(products.createdAt);
  }

  const rows = await db
    .select({
      productId: products.productId,
      productName: products.productName,
      productCode: products.productCode,
      basePrice: products.basePrice,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      categoryName: categories.categoryName,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.categoryId))
    .where(and(...conds))
    .orderBy(order)
    .limit(filter.limit ?? 24)
    .offset(filter.offset ?? 0);

  // Filter by color/size if requested (post-filter on variants)
  let filtered = rows;
  if (filter.colorHex || filter.sizeId) {
    const ids = rows.map((r) => r.productId);
    if (ids.length === 0) return [];
    const variantConds = [inArray(productVariants.productId, ids), eq(productVariants.isActive, 1)];
    const matchingVariants = await db
      .select({ productId: productVariants.productId, variantName: productVariants.variantName })
      .from(productVariants)
      .where(and(...variantConds));
    const matchingProductIds = new Set(
      matchingVariants
        .filter((v) => {
          const name = (v.variantName ?? "").toLowerCase();
          if (filter.colorHex) {
            const color = skuColorsByHex(filter.colorHex);
            if (color && !name.includes(color.toLowerCase())) return false;
          }
          if (filter.sizeId) {
            const size = skuSizesById(filter.sizeId);
            if (size && !name.includes(size.toLowerCase())) return false;
          }
          return true;
        })
        .map((v) => v.productId)
    );
    filtered = rows.filter((r) => matchingProductIds.has(r.productId));
  }

  return filtered;
}

// Color/size lookups (cached helpers)
const colorCache = new Map<string, string>();
async function _allColors() {
  if (colorCache.size > 0) return Array.from(colorCache.entries());
  const rows = await db.select().from(skuColors);
  rows.forEach((r) => {
    if (r.colorHex) colorCache.set(r.colorHex.toLowerCase(), r.colorName);
  });
  return Array.from(colorCache.entries());
}
function skuColorsByHex(hex: string): string | null {
  return colorCache.get(hex.toLowerCase()) ?? null;
}

const sizeCache = new Map<number, string>();
async function _allSizes() {
  if (sizeCache.size > 0) return Array.from(sizeCache.entries());
  const rows = await db.select().from(skuSizes);
  rows.forEach((r) => sizeCache.set(r.sizeId, r.sizeName));
  return Array.from(sizeCache.entries());
}
function skuSizesById(id: number): string | null {
  return sizeCache.get(id) ?? null;
}

export async function getColors() {
  await _allColors();
  return db.select().from(skuColors).where(eq(skuColors.isActive, 1)).orderBy(asc(skuColors.sortOrder));
}

export async function getSizes() {
  await _allSizes();
  return db.select().from(skuSizes).where(eq(skuSizes.isActive, 1)).orderBy(asc(skuSizes.sortOrder));
}

export async function getProductById(id: number) {
  const product = await db
    .select({
      productId: products.productId,
      productName: products.productName,
      productCode: products.productCode,
      basePrice: products.basePrice,
      description: products.description,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      categoryName: categories.categoryName,
      hasVariants: products.hasVariants,
      isActive: products.isActive,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.categoryId))
    .where(and(eq(products.productId, id), eq(products.isActive, 1)))
    .limit(1);
  if (!product[0]) return null;

  const variants = await db
    .select({
      variantId: productVariants.variantId,
      sku: productVariants.sku,
      variantName: productVariants.variantName,
      price: productVariants.price,
    })
    .from(productVariants)
    .where(and(eq(productVariants.productId, id), eq(productVariants.isActive, 1)))
    .orderBy(asc(productVariants.variantName));

  // Stock per variant (sum across locations)
  const stockRows = await db
    .select({
      variantId: inventory.variantId,
      qty: sql<number>`COALESCE(SUM(${inventory.quantityOnHand}), 0)`.as("qty"),
    })
    .from(inventory)
    .where(inArray(inventory.variantId, variants.map((v) => v.variantId)))
    .groupBy(inventory.variantId);
  const stock = new Map(stockRows.map((s) => [s.variantId, Number(s.qty)]));

  return {
    ...product[0],
    variants: variants.map((v) => ({ ...v, stock: stock.get(v.variantId) ?? 0 })),
  };
}

export async function getSettings() {
  const rows = await db.select().from(settings).where(eq(settings.isPublic, 1));
  const out: Record<string, string> = {};
  rows.forEach((r) => {
    if (r.settingKey && r.settingValue != null) out[r.settingKey] = String(r.settingValue);
  });
  return out;
}

export async function getHeadquartersLocation() {
  const rows = await db
    .select()
    .from(locations)
    .where(and(eq(locations.isActive, 1), eq(locations.isHeadquarters, 1)))
    .limit(1);
  return rows[0] ?? null;
}
