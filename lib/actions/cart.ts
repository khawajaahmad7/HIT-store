"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { cartItems, productVariants, products } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { createSale } from "@/lib/db/queries/sales";
import { findCustomerById } from "@/lib/db/queries/customers";

const CART_COOKIE = "hh_cart";

function getAnonCart(): { variantId: number; quantity: number }[] {
  try {
    const raw = cookies().get(CART_COOKIE)?.value;
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function setAnonCart(items: { variantId: number; quantity: number }[]) {
  cookies().set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export type CartLine = {
  cartItemId?: number;
  variantId: number;
  quantity: number;
  productId: number;
  productName: string;
  productCode: string;
  basePrice: string;
  imageUrl: string | null;
  categoryName: string | null;
  variantName: string | null;
  stock: number;
};

export async function getCart(): Promise<CartLine[]> {
  const session = await auth();
  if (session?.user?.customerId) {
    const rows = await db
      .select({
        cartItemId: cartItems.cartItemId,
        variantId: cartItems.variantId,
        quantity: cartItems.quantity,
        productId: productVariants.productId,
        productName: products.productName,
        productCode: products.productCode,
        basePrice: products.basePrice,
        imageUrl: products.imageUrl,
        variantName: productVariants.variantName,
        price: productVariants.price,
      })
      .from(cartItems)
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.variantId))
      .leftJoin(products, eq(productVariants.productId, products.productId))
      .where(eq(cartItems.customerId, session.user.customerId));
    return rows.map((r) => ({
      cartItemId: r.cartItemId,
      variantId: r.variantId,
      quantity: r.quantity,
      productId: r.productId ?? 0,
      productName: r.productName ?? "Product",
      productCode: r.productCode ?? "",
      basePrice: String(r.price ?? r.basePrice ?? 0),
      imageUrl: r.imageUrl ?? null,
      categoryName: null,
      variantName: r.variantName,
      stock: 99,
    }));
  } else {
    const anon = getAnonCart();
    if (anon.length === 0) return [];
    const variantIds = anon.map((a) => a.variantId);
    const allVariants = await db
      .select({
        variantId: productVariants.variantId,
        productId: productVariants.productId,
        productName: products.productName,
        productCode: products.productCode,
        imageUrl: products.imageUrl,
        variantName: productVariants.variantName,
        price: productVariants.price,
      })
      .from(productVariants)
      .leftJoin(products, eq(productVariants.productId, products.productId))
      .where(eq(productVariants.isActive, 1));
    const map = new Map(allVariants.filter((v) => variantIds.includes(v.variantId)).map((v) => [v.variantId, v]));
    return anon
      .map((a) => {
        const v = map.get(a.variantId);
        if (!v) return null;
        return {
          variantId: a.variantId,
          quantity: a.quantity,
          productId: v.productId ?? 0,
          productName: v.productName ?? "Product",
          productCode: v.productCode ?? "",
          basePrice: String(v.price ?? 0),
          imageUrl: v.imageUrl ?? null,
          categoryName: null,
          variantName: v.variantName,
          stock: 99,
        };
      })
      .filter(Boolean) as CartLine[];
  }
}

const addSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export async function addToCartAction(input: { variantId: number; quantity?: number }) {
  const parsed = addSchema.parse(input);
  const session = await auth();

  if (session?.user?.customerId) {
    // upsert
    const existing = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.customerId, session.user.customerId), eq(cartItems.variantId, parsed.variantId)))
      .limit(1);
    if (existing[0]) {
      await db
        .update(cartItems)
        .set({ quantity: existing[0].quantity + parsed.quantity, updatedAt: new Date() })
        .where(eq(cartItems.cartItemId, existing[0].cartItemId));
    } else {
      await db.insert(cartItems).values({
        customerId: session.user.customerId,
        variantId: parsed.variantId,
        quantity: parsed.quantity,
      });
    }
  } else {
    const cart = getAnonCart();
    const idx = cart.findIndex((c) => c.variantId === parsed.variantId);
    if (idx >= 0) cart[idx].quantity += parsed.quantity;
    else cart.push({ variantId: parsed.variantId, quantity: parsed.quantity });
    setAnonCart(cart);
  }
  revalidatePath("/cart");
}

const updateSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(0).max(99),
});

export async function updateCartQuantityAction(input: { variantId: number; quantity: number }) {
  const parsed = updateSchema.parse(input);
  const session = await auth();
  if (session?.user?.customerId) {
    if (parsed.quantity === 0) {
      await db
        .delete(cartItems)
        .where(and(eq(cartItems.customerId, session.user.customerId), eq(cartItems.variantId, parsed.variantId)));
    } else {
      await db
        .update(cartItems)
        .set({ quantity: parsed.quantity, updatedAt: new Date() })
        .where(and(eq(cartItems.customerId, session.user.customerId), eq(cartItems.variantId, parsed.variantId)));
    }
  } else {
    const cart = getAnonCart();
    const idx = cart.findIndex((c) => c.variantId === parsed.variantId);
    if (idx >= 0) {
      if (parsed.quantity === 0) cart.splice(idx, 1);
      else cart[idx].quantity = parsed.quantity;
      setAnonCart(cart);
    }
  }
  revalidatePath("/cart");
}

export async function removeFromCartAction(variantId: number) {
  const session = await auth();
  if (session?.user?.customerId) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.customerId, session.user.customerId), eq(cartItems.variantId, variantId)));
  } else {
    const cart = getAnonCart().filter((c) => c.variantId !== variantId);
    setAnonCart(cart);
  }
  revalidatePath("/cart");
}

const checkoutSchema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  notes: z.string().optional(),
});

export async function placeOrderAction(input: {
  address: string;
  city: string;
  notes?: string;
}): Promise<{ ok: boolean; error?: string; saleId?: number; saleNumber?: string; whatsappUrl?: string }> {
  const session = await auth();
  if (!session?.user?.customerId) {
    return { ok: false, error: "Please log in to place an order" };
  }
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const cart = await getCart();
  if (cart.length === 0) return { ok: false, error: "Your cart is empty" };

  const subtotal = cart.reduce((s, c) => s + Number(c.basePrice) * c.quantity, 0);
  const tax = 0;
  const total = subtotal + tax;

  try {
    const { saleId, saleNumber } = await createSale({
      customerId: session.user.customerId,
      locationId: 1, // HQ
      subtotal,
      taxAmount: tax,
      totalAmount: total,
      items: cart.map((c) => ({
        variantId: c.variantId,
        quantity: c.quantity,
        unitPrice: Number(c.basePrice),
        lineTotal: Number(c.basePrice) * c.quantity,
      })),
      deliveryAddress: parsed.data.address,
      deliveryCity: parsed.data.city,
      customerNotes: parsed.data.notes,
      whatsappSent: true,
    });

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.customerId, session.user.customerId));
    setAnonCart([]);

    // Build WhatsApp message
    const customer = await findCustomerById(session.user.customerId);
    const whatsappUrl = buildWhatsAppUrl({ saleNumber, cart, total, address: parsed.data.address, city: parsed.data.city, customerName: customer?.firstName ?? "Customer" });

    revalidatePath("/orders");
    return { ok: true, saleId, saleNumber, whatsappUrl };
  } catch (err: any) {
    console.error("placeOrder", err);
    return { ok: false, error: "Failed to place order. Please try again." };
  }
}

function buildWhatsAppUrl(args: { saleNumber: string; cart: CartLine[]; total: number; address: string; city: string; customerName: string }) {
  const phone = process.env.WHATSAPP_NUMBER ?? "";
  const lines = [
    `*New Order — ${args.saleNumber}*`,
    `Customer: ${args.customerName}`,
    "",
    "*Items:*",
    ...args.cart.map((c) => `• ${c.productName}${c.variantName ? ` (${c.variantName})` : ""} × ${c.quantity} — PKR ${(Number(c.basePrice) * c.quantity).toLocaleString()}`),
    "",
    `*Total:* PKR ${args.total.toLocaleString()}`,
    `*Delivery:* ${args.address}, ${args.city}`,
    "",
    "Please confirm my order. Thank you!",
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phone}?text=${text}`;
}
