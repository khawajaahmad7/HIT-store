import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  tinyint,
  datetime,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

/* ============================================================
   CATALOG
   ============================================================ */

export const categories = mysqlTable(
  "categories",
  {
    categoryId: int("category_id").autoincrement().primaryKey(),
    categoryName: varchar("category_name", { length: 100 }).notNull(),
    parentCategoryId: int("parent_category_id"),
    description: varchar("description", { length: 500 }),
    sortOrder: int("sort_order").default(0),
    isActive: tinyint("is_active").default(1),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
    categoryCode: varchar("category_code", { length: 10 }),
  },
  (t) => ({
    nameIdx: uniqueIndex("categories_category_name_unique").on(t.categoryName),
  })
);

export const products = mysqlTable(
  "products",
  {
    productId: int("product_id").autoincrement().primaryKey(),
    productCode: varchar("product_code", { length: 50 }).notNull(),
    productName: varchar("product_name", { length: 200 }).notNull(),
    categoryId: int("category_id"),
    description: text("description"),
    basePrice: decimal("base_price", { precision: 18, scale: 2 }).notNull(),
    costPrice: decimal("cost_price", { precision: 18, scale: 2 }).default("0.00"), // SERVER ONLY
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0.00"),
    hasVariants: tinyint("has_variants").default(0),
    propagatePrice: tinyint("propagate_price").default(1),
    imageUrl: varchar("image_url", { length: 500 }),
    tags: varchar("tags", { length: 500 }),
    isActive: tinyint("is_active").default(1),
    createdBy: int("created_by"),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    codeIdx: uniqueIndex("products_product_code_key").on(t.productCode),
    categoryIdx: index("products_category_idx").on(t.categoryId),
  })
);

export const productVariants = mysqlTable(
  "product_variants",
  {
    variantId: int("variant_id").autoincrement().primaryKey(),
    productId: int("product_id").notNull(),
    sku: varchar("sku", { length: 50 }).notNull(),
    barcode: varchar("barcode", { length: 50 }),
    variantName: varchar("variant_name", { length: 200 }),
    price: decimal("price", { precision: 18, scale: 2 }).notNull(),
    costPrice: decimal("cost_price", { precision: 18, scale: 2 }).default("0.00"), // SERVER ONLY
    weight: decimal("weight", { precision: 10, scale: 3 }),
    isDefault: tinyint("is_default").default(0),
    isActive: tinyint("is_active").default(1),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    skuIdx: uniqueIndex("product_variants_sku_key").on(t.sku),
    barcodeIdx: uniqueIndex("product_variants_barcode_key").on(t.barcode),
    productIdx: index("product_variants_product_idx").on(t.productId),
  })
);

export const skuColors = mysqlTable("sku_colors", {
  colorId: int("color_id").autoincrement().primaryKey(),
  colorName: varchar("color_name", { length: 50 }).notNull(),
  colorCode: int("color_code"),
  colorHex: varchar("color_hex", { length: 7 }),
  sortOrder: int("sort_order").default(0),
  isActive: tinyint("is_active").default(1),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const skuSizes = mysqlTable("sku_sizes", {
  sizeId: int("size_id").autoincrement().primaryKey(),
  sizeName: varchar("size_name", { length: 50 }).notNull(),
  sizeCode: int("size_code"),
  sortOrder: int("sort_order").default(0),
  isActive: tinyint("is_active").default(1),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ============================================================
   INVENTORY (read-only for storefront — we decrement on order)
   ============================================================ */

export const inventory = mysqlTable(
  "inventory",
  {
    inventoryId: int("inventory_id").autoincrement().primaryKey(),
    variantId: int("variant_id").notNull(),
    locationId: int("location_id").notNull(),
    quantityOnHand: int("quantity_on_hand").default(0),
    quantityReserved: int("quantity_reserved").default(0),
    reorderLevel: int("reorder_level").default(5),
    reorderQuantity: int("reorder_quantity").default(10),
    binLocation: varchar("bin_location", { length: 50 }),
    lastStockCheck: datetime("last_stock_check"),
    updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    variantLocIdx: uniqueIndex("inventory_variant_id_location_id_key").on(t.variantId, t.locationId),
  })
);

/* ============================================================
   PEOPLE
   ============================================================ */

export const customers = mysqlTable(
  "customers",
  {
    customerId: int("customer_id").autoincrement().primaryKey(),
    phone: varchar("phone", { length: 20 }).notNull(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }),
    email: varchar("email", { length: 100 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    loyaltyPoints: int("loyalty_points").default(0),
    walletBalance: decimal("wallet_balance", { precision: 18, scale: 2 }).default("0.00"),
    totalPurchases: decimal("total_purchases", { precision: 18, scale: 2 }).default("0.00"),
    visitCount: int("visit_count").default(0),
    notes: text("notes"),
    isActive: tinyint("is_active").default(1),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
    passwordHash: varchar("password_hash", { length: 255 }), // added by migration 0001
  },
  (t) => ({
    phoneIdx: uniqueIndex("customers_phone_key").on(t.phone),
  })
);

/* ============================================================
   ORDERS
   ============================================================ */

export const sales = mysqlTable(
  "sales",
  {
    saleId: int("sale_id").autoincrement().primaryKey(),
    saleNumber: varchar("sale_number", { length: 50 }),
    locationId: int("location_id").notNull(),
    shiftId: int("shift_id"),
    userId: int("user_id"),
    customerId: int("customer_id"),
    subtotal: decimal("subtotal", { precision: 18, scale: 2 }).default("0.00"),
    taxAmount: decimal("tax_amount", { precision: 18, scale: 2 }).default("0.00"),
    discountAmount: decimal("discount_amount", { precision: 18, scale: 2 }).default("0.00"),
    discountType: varchar("discount_type", { length: 20 }),
    discountReason: varchar("discount_reason", { length: 200 }),
    totalAmount: decimal("total_amount", { precision: 18, scale: 2 }).default("0.00"),
    status: varchar("status", { length: 30 }).default("completed"),
    notes: text("notes"),
    voidedBy: int("voided_by"),
    voidedAt: datetime("voided_at"),
    voidReason: text("void_reason"),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    customerIdx: index("sales_customer_idx").on(t.customerId),
  })
);

export const saleItems = mysqlTable("sale_items", {
  saleItemId: int("sale_item_id").autoincrement().primaryKey(),
  saleId: int("sale_id").notNull(),
  variantId: int("variant_id"),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 18, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 18, scale: 2 }).default("0.00"),
  taxAmount: decimal("tax_amount", { precision: 18, scale: 2 }).default("0.00"),
  lineTotal: decimal("line_total", { precision: 18, scale: 2 }),
  notes: varchar("notes", { length: 500 }),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const salePayments = mysqlTable("sale_payments", {
  salePaymentId: int("sale_payment_id").autoincrement().primaryKey(),
  saleId: int("sale_id").notNull(),
  paymentMethodId: int("payment_method_id"),
  amount: decimal("amount", { precision: 18, scale: 2 }),
  referenceNumber: varchar("reference_number", { length: 100 }),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const paymentMethods = mysqlTable("payment_methods", {
  paymentMethodId: int("payment_method_id").autoincrement().primaryKey(),
  methodName: varchar("method_name", { length: 50 }).notNull(),
  methodType: varchar("method_type", { length: 20 }).notNull(),
  isActive: tinyint("is_active").default(1),
  requiresReference: tinyint("requires_reference").default(0),
  sortOrder: int("sort_order").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ============================================================
   META
   ============================================================ */

export const locations = mysqlTable("locations", {
  locationId: int("location_id").autoincrement().primaryKey(),
  locationCode: varchar("location_code", { length: 20 }).notNull(),
  locationName: varchar("location_name", { length: 100 }).notNull(),
  address: varchar("address", { length: 500 }),
  city: varchar("city", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  isActive: tinyint("is_active").default(1),
  isHeadquarters: tinyint("is_headquarters").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const settings = mysqlTable("settings", {
  settingId: int("setting_id").autoincrement().primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull(),
  settingValue: text("setting_value"),
  settingType: varchar("setting_type", { length: 20 }),
  description: varchar("description", { length: 500 }),
  isPublic: tinyint("is_public").default(0),
  updatedBy: int("updated_by"),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ============================================================
   STOREFRONT-ONLY TABLES (created by migrations 0002, 0003)
   ============================================================ */

export const cartItems = mysqlTable(
  "cart_items",
  {
    cartItemId: int("cart_item_id").autoincrement().primaryKey(),
    customerId: int("customer_id").notNull(),
    variantId: int("variant_id").notNull(),
    quantity: int("quantity").notNull().default(1),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    uniq: uniqueIndex("cart_items_customer_variant_key").on(t.customerId, t.variantId),
    customerIdx: index("cart_items_customer_idx").on(t.customerId),
  })
);

export const onlineOrdersMeta = mysqlTable("online_orders_meta", {
  onlineOrderId: int("online_order_id").autoincrement().primaryKey(),
  saleId: int("sale_id").notNull(),
  deliveryAddress: text("delivery_address"),
  deliveryCity: varchar("delivery_city", { length: 100 }),
  customerNotes: text("customer_notes"),
  whatsappSent: tinyint("whatsapp_sent").default(0),
  status: varchar("status", { length: 30 }).default("pending"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/* ============================================================
   INFERRED TYPES
   ============================================================ */

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type SkuColor = typeof skuColors.$inferSelect;
export type SkuSize = typeof skuSizes.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type SaleItem = typeof saleItems.$inferSelect;
export type SalePayment = typeof salePayments.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type OnlineOrderMeta = typeof onlineOrdersMeta.$inferSelect;
