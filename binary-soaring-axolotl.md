# Next-Generation Editorial Redesign — HIT by Huma

## Context

The current site is functional but feels **generic / template-y**: oversized display text, basic fade-up animations, and a layout that doesn't differentiate it from any other boutique store. The user wants it to feel like a **Dribbble-grade, next-generation Asian boutique** — quiet, editorial, premium — with modern typography, scroll-driven storytelling, and refined motion.

**Decisions captured from the user:**

- **Aesthetic:** Minimalist Editorial (warm cream/ivory, oversized serif, huge whitespace, image-first spreads, slow Ken-Burns).
- **Type system:** keep Playfair Display (display) + Inter (sans) + add Noto Nastaliq Urdu (heritage accent).
- **Effects:** text reveals, parallax, sticky / horizontal scroll section, marquee + stagger fade-up.
- **Navbar logo:** logo only (no duplicate "HIT BY HUMA" text next to it).

The product images stay as gradient placeholders (per earlier decision). Real Unsplash photos remain on hero / category cards / story / about.

---

## Design System (foundations)

### Typography scale — tighter & more editorial

Replace the current `display-xl/lg/md` clamps (which run up to `7.5rem` / `5rem`) with a more refined scale:

```
display-2xl : clamp(4.5rem, 11vw, 9rem)    // hero only
display-xl  : clamp(3.25rem, 7vw, 5.5rem)  // section titles
display-lg  : clamp(2.25rem, 4.5vw, 3.75rem)
display-md  : clamp(1.75rem, 3vw, 2.75rem)
```

Plus body sizes tightened (`text-base` = 0.9375rem / 15px, `text-sm` = 0.8125rem, `text-xs` = 0.6875rem with wider tracking on uppercase). Less "shouty", more "fashion magazine".

### Font loading

In `app/layout.tsx`, keep Playfair + Inter + Noto Nastaliq. Use `display: "swap"` and add `preload: true` for the display weights. Add a CSS variable for a new **mono** (`var(--font-mono)` = `JetBrains Mono`) used only in tiny caption labels (e.g. "01 / Velvet").

### Color

Keep brand palette but **introduce a "paper" surface** (`#F5F0E6` — a slightly warmer ivory) for editorial sections, and a near-black "ink" (`#0E0E0E`) for high-contrast moments. Existing tokens stay.

### Motion library

`framer-motion` is **already installed** (v11.3.21). Reuse it. Add `lenis` (lightweight smooth scroll, ~3KB) for buttery scroll feel — drop-in via `app/layout.tsx` Provider. New devDep: `lenis@^1.1`.

### Layout primitives (new shared components)

- `components/motion/TextReveal.tsx` — wraps text, animates per-word / per-letter on viewport entry using `useScroll` + `useTransform`.
- `components/motion/Parallax.tsx` — wraps an element, applies `y` transform based on scroll progress.
- `components/motion/Marquee.tsx` — infinite horizontal ticker, configurable speed & direction.
- `components/motion/StickySection.tsx` — pins a section while text changes (used for "Our Story" or category spotlight).
- `components/motion/StaggerReveal.tsx` — staggered child fade-up (replaces inline `FadeIn` with a richer API).
- `components/motion/SmoothScroll.tsx` — Lenis wrapper, used in `Providers.tsx`.

Keep the existing `FadeIn` for back-compat but mark it deprecated.

---

## Page-by-Page Changes

### 1. `app/layout.tsx`
- Add Lenis smooth scroll provider.
- Add `JetBrains_Mono` font for caption labels.
- Make body use new `--font-sans` tighter tracking on body.

### 2. `app/globals.css`
- New tokens: `--paper`, refined `--ink`, motion easings (`--ease-out-expo`).
- Replace oversized font scale.
- Add `text-balance` utility, `text-pretty` for headings.
- Custom cursor styles (subtle): `.cursor-dot`, `.cursor-ring` (visible only on pointer-fine devices) — Dribbble staple. Disabled by default; can be toggled.

### 3. `tailwind.config.ts`
- Update font sizes to the new scale.
- Add new colors (`paper`).
- Add keyframes: `marquee-x`, `marquee-x-reverse`, `text-rise`, `pulse-soft`.
- Update `fontFamily.mono` = `var(--font-jetbrains)`.

### 4. `components/layout/Navbar.tsx`
- Drop the "HIT BY HUMA" text beside the logo — show **only the PNG mark** (per user choice).
- Add a thin top accent line (1px) that animates from `0%` to `100%` width on page load.
- Convert nav links to use **per-letter text reveal** on hover (subtle mask reveal, not full animation).
- Replace Search icon with a small inline "Search" link that expands a full-width overlay search on click (text input that searches `/shop?q=`).
- On scroll, change `h-20` to `h-16` for a tighter, more refined feel.
- Add a slim **"Free shipping over PKR 15,000"** announcement bar that sits above the navbar and auto-hides after 3s or on scroll (with cookie/localStorage for "don't show again" — keep simple: just hide on scroll).

### 5. `components/layout/Footer.tsx`
- Big editorial footer: oversized "HIT BY HUMA" wordmark on the left, links in 3 columns, newsletter signup right.
- Use a dark `#0E0E0E` background with `text-paper`.
- Add a **marquee strip** above the footer with brand words: "VELVET · SILK · CHIFFON · LAWN · HERITAGE · LAHORE ·" repeating.
- Add a Noto Nastaliq line as a decorative accent (e.g. "ہِٹ بِ ہُما" in a small block).

### 6. `components/store/Hero.tsx` (full rewrite)
- **New layout:** split-screen editorial. Left: huge stacked serif "Drape / in / Heritage." with per-line mask reveal. Right: large image with a caption block.
- Top-left: small label "01 / Autumn-Winter 26" (mono caption).
- Bottom: a single "Shop Collection →" link, no other CTA.
- Scroll indicator: replaced with a thin vertical line + "Scroll" text rotating 90° on the right edge.
- Ken-Burns on the image stays.
- Use `TextReveal` for the headline (per-word mask animation triggered on mount).

### 7. `components/store/CategoryMosaic.tsx` (refactor → `CategoryEditorial.tsx`)
- Replace the bento grid with a **horizontal scroll-snap row** of large cards.
- Each card: full-bleed image with a vertical label, category name set huge on the side in a serif.
- Cards reveal on horizontal scroll position (parallax).
- Use `Marquee` strip below: a single line of all category names in serif, slowly moving, repeated.

### 8. `components/store/ProductGrid.tsx` & `ProductCarousel.tsx`
- Tighter grid: 2 columns on mobile, 3 on tablet, 4 on desktop with smaller gap.
- **Sticky product card reveal:** cards fade up + slight scale as they enter viewport.
- Hover: image scales, small "→" arrow translates right.
- Carousel: replace with the same grid layout but on mobile a snap-scroll row.

### 9. `components/store/ProductCard.tsx`
- Reduce image aspect from `4/5` to `3/4` for a more editorial proportion.
- Replace "View Product →" hover overlay with a small line that draws from left to right under the title.
- Price uses an **inline mono caption** like "PKR 14,500" instead of styled color.
- Tighter, less rounded corners (`rounded-md` instead of `rounded-2xl`).

### 10. `app/(storefront)/page.tsx` (Homepage)
- **New section 1: Marquee strip** (auto-scrolling brand words) — sits below features strip.
- **New section 2: Editorial story** — full-bleed image with caption set into the side, using `StickySection` so the image pins and the text scrolls past.
- **New section 3: "The Edit"** — a single horizontal-scroll product strip with oversized product photography placeholders.
- **New section 4: "By the Numbers"** — three huge numerals in serif (e.g. `2025` founded, `4+` categories, `1k+` happy clients) with small mono captions.
- **New section 5: Newsletter** — a thin full-width band with a single email input and serif heading.
- Use `TextReveal` on all section headings.
- Use `Parallax` on the editorial story image.

### 11. `app/(storefront)/about/page.tsx`
- Big editorial hero: full-bleed image, single serif line centered with mask reveal.
- The "Heritage" quote block uses a `StickySection` — quote stays pinned on the left while paragraphs scroll past on the right.
- Use Noto Nastaliq line as a decorative callout.
- Values grid → 2x2 with image thumbnails on hover.

### 12. `app/(storefront)/shop/page.tsx` & `[slug]/page.tsx` & `ShopClient.tsx`
- Tighter page header: "Shop" set huge on the left, filter chips on the right.
- Sidebar collapsed by default behind a "Filters" toggle on mobile.
- Use a refined product grid (from #8).
- Add a sticky filter pill bar with horizontal scroll.

### 13. `app/(storefront)/product/[id]/ProductDetailClient.tsx`
- Two-column layout with sticky image on the left (image stays pinned while you scroll info on the right).
- Image gallery becomes a single image with thumbnail dots below (not 4 hardcoded copies).
- Variant selectors: replaced with text links separated by slashes (very editorial) instead of pills.
- Add a "You may also like" row at the bottom using `ProductCarousel`.

### 14. `app/(storefront)/cart/CartClient.tsx`
- Tighter layout, line items as a single-column list with thin dividers.
- Summary moves to a sticky right rail with a big serif total.
- Empty state becomes a single centered serif "Your cart is empty." with a line-drawn shopping bag illustration (inline SVG).

### 15. `app/(storefront)/checkout/CheckoutClient.tsx`
- Tighter, more editorial: section headings as huge serif, form inputs borderless with a single bottom line (instead of rounded boxes).
- Order summary as a thin right column.

### 16. `app/(storefront)/account/page.tsx` & `orders/page.tsx`
- Cleaner header (small mono label + big serif title).
- Loyalty / wallet cards become thin rows with huge serif numerals instead of gradient cards.
- Orders list: a single timeline-style list with thin connecting lines, not stacked cards.

### 17. `app/(auth)/login/page.tsx` & `register/page.tsx`
- Minimal form: borderless inputs with bottom line, big serif heading, single CTA button.
- Add a quiet background image with a heavy gradient overlay.

---

## Critical files to modify (representative)

- `app/layout.tsx`
- `app/globals.css`
- `tailwind.config.ts`
- `components/layout/Navbar.tsx`, `Footer.tsx`
- `components/store/Hero.tsx`, `CategoryMosaic.tsx` (→ `CategoryEditorial.tsx`)
- `components/store/ProductCard.tsx`, `ProductGrid.tsx`, `ProductCarousel.tsx`
- `app/(storefront)/page.tsx`, `about/page.tsx`, `shop/ShopClient.tsx`, `product/[id]/ProductDetailClient.tsx`, `cart/CartClient.tsx`, `checkout/CheckoutClient.tsx`, `account/page.tsx`, `orders/page.tsx`
- `app/(auth)/login/page.tsx`, `register/page.tsx`

**New files (motion primitives + new homepage sections):**
- `components/motion/SmoothScroll.tsx`
- `components/motion/TextReveal.tsx`
- `components/motion/Parallax.tsx`
- `components/motion/Marquee.tsx`
- `components/motion/StickySection.tsx`
- `components/motion/StaggerReveal.tsx`
- `components/store/MarqueeStrip.tsx`
- `components/store/StorySticky.tsx`
- `components/store/NumbersBlock.tsx`
- `components/store/EditCarousel.tsx`

**New devDep:** `lenis@^1.1` (smooth scroll, ~3 KB gz).

---

## Verification

1. `npm run dev` → open `http://localhost:3000`.
2. **Hero:** big stacked serif headline animates in word-by-word on load. Image has slow Ken-Burns. Scroll indicator visible.
3. **Scroll feel:** page is smooth (Lenis active).
4. **Categories:** horizontal scroll-snap row reveals as you scroll; marquee strip below moves.
5. **Product grid:** cards fade up + scale on viewport entry; hover draws an underline.
6. **Story section:** image pins while paragraphs scroll past (StickySection).
7. **By the numbers:** huge serif numerals with mono captions.
8. **Footer:** dark, with marquee strip + Noto Nastaliq accent.
9. **Product detail page:** image stays sticky on left while info scrolls on right.
10. **Auth / cart / checkout / account / orders** all show the refined borderless-form / line-divided-list aesthetic.
11. **Build check:** `npx tsc --noEmit` passes for all files I touched (pre-existing errors in `lib/auth.ts` and `lib/db/queries/products.ts` are out of scope).
12. **Mobile:** navbar collapses, hero scales to single column, marquee still works, product grid is 2 columns.
13. **No new TypeScript errors introduced.**
14. **Performance:** no obvious layout shift; Lenis doesn't break scroll restoration on back-nav.
