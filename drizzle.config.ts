import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["categories", "products", "product_variants", "sku_colors", "sku_sizes", "customers", "sales", "sale_items", "sale_payments", "settings", "locations", "payment_methods", "cart_items", "online_orders_meta"],
} satisfies Config;
