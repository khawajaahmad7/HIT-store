# HIT BY HUMA — Modern Boutique Storefront

A vibrant, eye-catching e-commerce site for **HIT BY HUMA** — a Pakistani boutique specializing in velvet kaftans, raw silk suits, chiffon, and lawn. Built with Next.js 14, TypeScript, Drizzle ORM, and MySQL.

## ✨ Design Direction

Vibrant South Asian boutique — in the spirit of Khaadi / Sana Safinaz. Royal maroon, saffron gold, peacock teal, on warm ivory. Playfair Display headings, Inter body, Framer Motion scroll reveals, dynamic SVG placeholders generated per category.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+ running locally (or a hosted MySQL URL)

### 2. Install
```bash
cd hit-by-huma
npm install
```

### 3. Set up the database
```bash
# Create database + import the existing dump
mysql -u root -p -e "CREATE DATABASE hit_by_huma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p hit_by_huma < ../backup.sql
```

### 4. Configure environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:
- `DATABASE_URL` — your MySQL connection string
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
- `WHATSAPP_NUMBER` — your WhatsApp Business number in international format (e.g. `923001234567`, no `+` or spaces)
- `NEXTAUTH_URL` — `http://localhost:3000` for dev, your production URL for prod

### 5. Run migrations
```bash
mysql -u root -p hit_by_huma < drizzle/0001_add_password_hash.sql
mysql -u root -p hit_by_huma < drizzle/0002_create_cart_items.sql
mysql -u root -p hit_by_huma < drizzle/0003_create_online_orders_meta.sql
```

### 6. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🧱 Architecture

```
app/                Next.js App Router
├── (storefront)/   Public site (home, shop, product, cart, checkout, orders, account, about)
├── (auth)/         Login + register
└── api/            API routes (auth, products, categories, cart, image placeholder)

components/
├── layout/         Navbar, Footer
└── store/          ProductCard, ProductGrid, ProductCarousel, CategoryMosaic, Hero, FadeIn

lib/
├── db/             Drizzle client, schema, queries
├── actions/        Server Actions (cart, checkout, auth)
├── auth.ts         NextAuth v5 config
├── currency.ts     PKR formatter
└── placeholders.ts Per-category gradient + dynamic image URL builder
```

## 🗄️ Database

The site reads from the **existing MySQL schema** in `backup.sql` (241 products, 34 categories, 27 colors, 5 sizes). Three small migrations add what the storefront needs:

| Migration | Adds | Why |
|---|---|---|
| `0001_add_password_hash.sql` | `customers.password_hash` | Online auth (POS PIN stays) |
| `0002_create_cart_items.sql` | `cart_items` table | Server-side cart for logged-in users |
| `0003_create_online_orders_meta.sql` | `online_orders_meta` table | Tracks online order state separately from POS sales |

The order flow **writes to `sales` / `sale_items` / `sale_payments`** so the POS system stays the single source of truth.

## 🛒 Order Flow

1. Browse → Add to cart (cookie-based for guests, server-side for logged-in)
2. Sign in or register
3. Checkout: enter address + city, optional notes
4. Click "Place Order":
   - Creates `sales` row (status='pending'), `sale_items`, `sale_payments` (Cash on Delivery), `online_orders_meta`
   - Decrements `inventory.quantity_on_hand` for each variant
   - Updates customer `total_purchases` and `visit_count`
   - Generates a `wa.me` link with the order summary
5. WhatsApp opens in a new tab with the order prefilled
6. Order appears in customer's `/orders` page

## 🎨 Adding Real Product Images

The `products.image_url` column is NULL for all rows in the current dump. The site renders category-tinted gradient placeholders in the meantime.

To add a real image, update the product row in MySQL:
```sql
UPDATE products SET image_url = 'https://cdn.yoursite.com/products/krs007.jpg' WHERE product_id = 45;
```

The site accepts any HTTPS URL via Next.js's image loader.

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add the env vars from `.env.local`
4. Add a hosted MySQL (PlanetScale, Railway, Neon MySQL) and put the URL in `DATABASE_URL`
5. Run the 3 migrations against the hosted DB
6. Deploy

## 📝 What's Out of Scope (v1)

- Real payment gateway (Stripe / JazzCash / EasyPaisa) — currently COD + WhatsApp
- Image upload UI (use SQL for now)
- Admin panel for online orders
- Email notifications
- Reviews, wishlists, recommendations
- i18n (English + Urdu)

## 📄 License

© HIT BY HUMA. All rights reserved.
