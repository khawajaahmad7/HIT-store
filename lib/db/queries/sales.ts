import { db } from "@/lib/db";
import { sales, saleItems, productVariants, products } from "@/lib/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import type { PoolConnection } from "mysql2/promise";

export type CreateSaleInput = {
  customerId: number;
  locationId: number;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  items: { variantId: number; quantity: number; unitPrice: number; lineTotal: number }[];
  deliveryAddress: string;
  deliveryCity: string;
  customerNotes?: string;
  whatsappSent?: boolean;
};

export async function createSale(input: CreateSaleInput) {
  const connection = (await db.$client) as any as PoolConnection;
  try {
    await connection.beginTransaction();

    // 1. Generate sale number
    const saleNumber = `WEB-${Date.now().toString(36).toUpperCase()}`;

    // 2. Insert sale
    const [saleResult] = await connection.execute(
      `INSERT INTO sales (sale_number, location_id, customer_id, subtotal, tax_amount, total_amount, status, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NOW(), NOW())`,
      [
        saleNumber,
        input.locationId,
        input.customerId,
        input.subtotal.toFixed(2),
        input.taxAmount.toFixed(2),
        input.totalAmount.toFixed(2),
        input.customerNotes ?? null,
      ]
    );
    const saleId = (saleResult as any).insertId;

    // 3. Insert sale items + decrement inventory
    for (const item of input.items) {
      await connection.execute(
        `INSERT INTO sale_items (sale_id, variant_id, quantity, unit_price, line_total, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [saleId, item.variantId, item.quantity, item.unitPrice.toFixed(2), item.lineTotal.toFixed(2)]
      );

      await connection.execute(
        `UPDATE inventory
         SET quantity_on_hand = quantity_on_hand - ?,
             updated_at = NOW()
         WHERE variant_id = ? AND quantity_on_hand >= ?
         ORDER BY location_id ASC
         LIMIT 1`,
        [item.quantity, item.variantId, item.quantity]
      );
    }

    // 4. Insert payment row
    const [pmRows] = await connection.execute(
      `SELECT payment_method_id FROM payment_methods WHERE method_name = 'Cash' AND method_type = 'cash' LIMIT 1`
    );
    const pm = (pmRows as any[])[0];
    if (pm) {
      await connection.execute(
        `INSERT INTO sale_payments (sale_id, payment_method_id, amount, created_at)
         VALUES (?, ?, ?, NOW())`,
        [saleId, pm.payment_method_id, input.totalAmount.toFixed(2)]
      );
    }

    // 5. Online order meta
    await connection.execute(
      `INSERT INTO online_orders_meta (sale_id, delivery_address, delivery_city, customer_notes, whatsapp_sent, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [
        saleId,
        input.deliveryAddress,
        input.deliveryCity,
        input.customerNotes ?? null,
        input.whatsappSent ? 1 : 0,
      ]
    );

    // 6. Update customer totals
    await connection.execute(
      `UPDATE customers
       SET total_purchases = total_purchases + ?,
           visit_count = visit_count + 1,
           updated_at = NOW()
       WHERE customer_id = ?`,
      [input.totalAmount.toFixed(2), input.customerId]
    );

    await connection.commit();
    return { saleId, saleNumber };
  } catch (err) {
    await connection.rollback();
    throw err;
  }
}

export async function getOrdersForCustomer(customerId: number) {
  const orderRows = await db
    .select({
      saleId: sales.saleId,
      saleNumber: sales.saleNumber,
      totalAmount: sales.totalAmount,
      status: sales.status,
      createdAt: sales.createdAt,
    })
    .from(sales)
    .where(eq(sales.customerId, customerId))
    .orderBy(desc(sales.createdAt));

  if (orderRows.length === 0) return [];

  const itemsRows = await db
    .select({
      saleId: saleItems.saleId,
      saleItemId: saleItems.saleItemId,
      variantId: saleItems.variantId,
      quantity: saleItems.quantity,
      unitPrice: saleItems.unitPrice,
      lineTotal: saleItems.lineTotal,
      productName: products.productName,
      productId: products.productId,
      variantName: productVariants.variantName,
    })
    .from(saleItems)
    .leftJoin(productVariants, eq(saleItems.variantId, productVariants.variantId))
    .leftJoin(products, eq(productVariants.productId, products.productId))
    .where(sql`${saleItems.saleId} IN (${sql.join(orderRows.map((o) => sql`${o.saleId}`), sql`, `)})`);

  return orderRows.map((o) => ({
    ...o,
    items: itemsRows.filter((i) => i.saleId === o.saleId),
  }));
}

export async function getOrderById(saleId: number, customerId: number) {
  const rows = await db.select().from(sales).where(and(eq(sales.saleId, saleId), eq(sales.customerId, customerId))).limit(1);
  const order = rows[0];
  if (!order) return null;

  const items = await db
    .select({
      saleItemId: saleItems.saleItemId,
      variantId: saleItems.variantId,
      quantity: saleItems.quantity,
      unitPrice: saleItems.unitPrice,
      lineTotal: saleItems.lineTotal,
      productName: products.productName,
      productId: products.productId,
      variantName: productVariants.variantName,
    })
    .from(saleItems)
    .leftJoin(productVariants, eq(saleItems.variantId, productVariants.variantId))
    .leftJoin(products, eq(productVariants.productId, products.productId))
    .where(eq(saleItems.saleId, saleId));

  return { ...order, items };
}
