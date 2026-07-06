/**
 * Image strategy:
 *  - Products keep the dynamic gradient placeholder (category-preset based)
 *    because the user wants product images to remain as gradient placeholders.
 *  - Categories / hero / story / about use curated free Unsplash photos
 *    relevant to Pakistani couture, velvet, silk, embroidery, looms, etc.
 *
 * All Unsplash URLs use ?auto=format&fit=crop&w=...&q=80 for fast, clear delivery.
 * They resolve to https://images.unsplash.com/...
 */

export type CategoryImage = {
  /** Lead image used as the category card background */
  src: string;
  /** Photographer credit (Unsplash license requires attribution where possible) */
  credit?: string;
};

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * Curated photos per category keyword. Each category picks the first match.
 * Photos are clear, high-contrast editorial-style fashion / textile images.
 */
const CATEGORY_IMAGES: { match: RegExp; img: CategoryImage }[] = [
  // Velvet (deep, moody, embroidered)
  {
    match: /velvet/i,
    img: {
      src: "/categories/velvet.png",
      credit: "Bespoke Model",
    },
  },
  // Lawn / cotton — light, floral, breezy
  {
    match: /lawn|cotton/i,
    img: {
      src: "/categories/lawn.png",
      credit: "Bespoke Model",
    },
  },
  // Chiffon / georgette / net / organza — light, sheer
  {
    match: /chiffon|georgette|net|organza/i,
    img: {
      src: "/categories/gota.png",
      credit: "Bespoke Model",
    },
  },
  // Raw silk / korean raw silk / shamoz / sheesha / lama silk / silk
  {
    match: /raw\s*silk|korean|shamoz|sheesha|lama|silk|karandi|khaddar|linen|marina/i,
    img: {
      src: "/categories/silk.png",
      credit: "Bespoke Model",
    },
  },
  // Gota / kinari / jaal / embroidered — gold-thread close-up
  {
    match: /gota|kinari|jaal|embroid/i,
    img: {
      src: "/categories/gota.png",
      credit: "Bespoke Model",
    },
  },
  // Charmouse / kaftan — flowing
  {
    match: /charmouse|kaftan|kaftaan/i,
    img: {
      src: "/categories/kaftan.png",
      credit: "Bespoke Model",
    },
  },
  // Shawl
  {
    match: /shawl/i,
    img: {
      src: "/categories/shawl.png",
      credit: "Bespoke Model",
    },
  },
  // Denim
  {
    match: /denim|jeans/i,
    img: {
      src: "/categories/silk.png",
      credit: "Bespoke Model",
    },
  },
  // Purse / bag / accessories
  {
    match: /purse|bag|clutch|accessor/i,
    img: {
      src: "/categories/gota.png",
      credit: "Bespoke Model",
    },
  },
  // Toys
  {
    match: /toy/i,
    img: {
      src: "/categories/lawn.png",
      credit: "Bespoke Model",
    },
  },
  // Men
  {
    match: /men/i,
    img: {
      src: "/categories/silk.png",
      credit: "Bespoke Model",
    },
  },
  // Unstitched fallback
  {
    match: /unstitched/i,
    img: {
      src: "/categories/lawn.png",
      credit: "Bespoke Model",
    },
  },
];

/** Default hero image when no category match. */
const DEFAULT_CATEGORY_IMAGE: CategoryImage = {
  src: "/categories/velvet.png",
  credit: "Bespoke Model",
};

/** Look up a curated category photo by name. Falls back to a default. */
export function categoryImage(categoryName: string): CategoryImage {
  const hit = CATEGORY_IMAGES.find((m) => m.match.test(categoryName));
  return hit?.img ?? DEFAULT_CATEGORY_IMAGE;
}

/**
 * Maps a category name to a vibrant gradient pair + accent.
 * Used as the BACKGROUND of a product card (product images are gradient placeholders).
 * Falls back to a deterministic HSL derived from the category id.
 */
const CATEGORY_PRESETS: Record<string, { from: string; to: string; accent: string }> = {
  "velvet kaftan": { from: "#7B1E3A", to: "#E0A526", accent: "#FBF6EE" },
  "korean raw silk": { from: "#0F6E6E", to: "#7B1E3A", accent: "#FBF6EE" },
  "gota kinari dupatta suit": { from: "#E0A526", to: "#7B1E3A", accent: "#1A1A1A" },
  "unstitched velvet suit": { from: "#4A0E22", to: "#E0A526", accent: "#FBF6EE" },
  "gota shiffon unstitched": { from: "#D2691E", to: "#7B1E3A", accent: "#FBF6EE" },
  "gota georgete unstitched": { from: "#C19A6B", to: "#7B1E3A", accent: "#FBF6EE" },
  "shamoz silk dress": { from: "#0F6E6E", to: "#E0A526", accent: "#1A1A1A" },
  "charmouse + velvet": { from: "#5C0A1F", to: "#0F6E6E", accent: "#FBF6EE" },
  "raw silk jaal": { from: "#8B4513", to: "#E0A526", accent: "#FBF6EE" },
  "unstitched": { from: "#7B1E3A", to: "#0F6E6E", accent: "#FBF6EE" },
  "denim jeans": { from: "#1E3A8A", to: "#475569", accent: "#FBF6EE" },
  "ladies purse": { from: "#7B1E3A", to: "#1A1A1A", accent: "#E0A526" },
  "shawl": { from: "#5C0A1F", to: "#E0A526", accent: "#FBF6EE" },
  "velvet dress stitched": { from: "#7B1E3A", to: "#4A0E22", accent: "#E0A526" },
  "velvet printed black": { from: "#0A0A0A", to: "#7B1E3A", accent: "#E0A526" },
  "normal raw silk": { from: "#A0826D", to: "#7B1E3A", accent: "#FBF6EE" },
  "khaddar": { from: "#8B7355", to: "#E0A526", accent: "#1A1A1A" },
  "marina": { from: "#1E40AF", to: "#0F6E6E", accent: "#FBF6EE" },
  "linen": { from: "#D4C5A0", to: "#7B1E3A", accent: "#1A1A1A" },
  "karandi": { from: "#A0826D", to: "#0F6E6E", accent: "#FBF6EE" },
  "velvet dress": { from: "#7B1E3A", to: "#E0A526", accent: "#FBF6EE" },
  "unstitched men": { from: "#1A1A1A", to: "#7B1E3A", accent: "#E0A526" },
  "men unstitched": { from: "#1A1A1A", to: "#E0A526", accent: "#FBF6EE" },
  "toys": { from: "#E0A526", to: "#0F6E6E", accent: "#7B1E3A" },
  "lama silk dress": { from: "#0F6E6E", to: "#7B1E3A", accent: "#E0A526" },
  "silk dress": { from: "#C19A6B", to: "#7B1E3A", accent: "#FBF6EE" },
  "stitched georgette": { from: "#FFB6C1", to: "#7B1E3A", accent: "#1A1A1A" },
  "sheesha silk": { from: "#9370DB", to: "#E0A526", accent: "#1A1A1A" },
  "kaftaan": { from: "#7B1E3A", to: "#0F6E6E", accent: "#E0A526" },
  "raw silk stitched": { from: "#A0826D", to: "#7B1E3A", accent: "#FBF6EE" },
  "cotton dress": { from: "#FBF6EE", to: "#7B1E3A", accent: "#1A1A1A" },
  "net stitched": { from: "#FFC0CB", to: "#0F6E6E", accent: "#1A1A1A" },
  "chiffon": { from: "#FFB6C1", to: "#0F6E6E", accent: "#1A1A1A" },
  "lawn": { from: "#98FB98", to: "#E0A526", accent: "#1A1A1A" },
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function categoryGradient(categoryName: string, categoryId?: number) {
  const key = categoryName.trim().toLowerCase();
  if (CATEGORY_PRESETS[key]) return CATEGORY_PRESETS[key];

  // Deterministic fallback from name/id
  const seed = hashString(key + String(categoryId ?? 0));
  const hue = seed % 360;
  return {
    from: hslToHex(hue, 70, 32),
    to: hslToHex((hue + 35) % 360, 70, 52),
    accent: "#FBF6EE",
  };
}

const VELVET_IDS = ["/products/p1.png"];
const SILK_IDS = ["/products/p2.png"];
const LAWN_IDS = ["/products/p3.png"];
const EMBROIDERY_IDS = ["/products/p4.png"];

export function placeholderImage(productId: number, productName: string, categoryName: string) {
  const cat = categoryName.toLowerCase();
  const name = productName.toLowerCase();
  
  let pool = ["/products/p1.png", "/products/p2.png", "/products/p3.png", "/products/p4.png"];
  if (cat.includes("velvet") || name.includes("velvet")) {
    pool = VELVET_IDS;
  } else if (cat.includes("silk") || name.includes("silk")) {
    pool = SILK_IDS;
  } else if (cat.includes("lawn") || cat.includes("cotton") || name.includes("lawn") || name.includes("cotton")) {
    pool = LAWN_IDS;
  } else if (cat.includes("gota") || cat.includes("chiffon") || name.includes("gota") || name.includes("chiffon")) {
    pool = EMBROIDERY_IDS;
  }
  
  return pool[productId % pool.length];
}

/* ------------------------------------------------------------------ */
/*  Curated site-wide images                                          */
/* ------------------------------------------------------------------ */

/** Hero image — main banner above the fold. */
export const HERO_IMAGE = {
  src: "/hero_slide_1.png",
  credit: "Bespoke Model",
};

/** Story section image on the homepage ("Born in Lahore…"). */
export const STORY_IMAGE = {
  src: "/story.png",
  credit: "Bespoke Model",
};

/** About page hero image. */
export const ABOUT_HERO_IMAGE = {
  src: "/hero_slide_2.png",
  credit: "Bespoke Model",
};

/** About page editorial image (weavers / artisans). */
export const ABOUT_EDITORIAL_IMAGE = {
  src: "/categories/velvet.png",
  credit: "Bespoke Model",
};

/** Collection of "looks" / editorial shots for the homepage features strip or future gallery. */
export const EDITORIAL_LOOKS = [
  { src: "/products/p1.png", alt: "Velvet kaftan" },
  { src: "/products/p2.png", alt: "Silk drape" },
  { src: "/products/p3.png", alt: "Embroidered detail" },
  { src: "/products/p4.png", alt: "Raw silk" },
];
