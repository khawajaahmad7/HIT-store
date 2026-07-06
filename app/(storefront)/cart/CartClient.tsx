"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { formatPKR } from "@/lib/currency";
import { placeholderImage } from "@/lib/placeholders";
import { updateCartQuantityAction, removeFromCartAction } from "@/lib/actions/cart";
import type { CartLine } from "@/lib/actions/cart";

export default function CartClient({ cart }: { cart: CartLine[] }) {
  const [pending, startTransition] = useTransition();

  const subtotal = cart.reduce((s, c) => s + Number(c.basePrice) * c.quantity, 0);
  const shipping = subtotal >= 15000 ? 0 : 250;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <svg
          className="h-16 w-16 text-ink/30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h1 className="mt-6 font-display text-3xl md:text-4xl font-bold text-ink">Your cart is empty.</h1>
        <p className="mt-2 text-sm text-ink/50 font-mono uppercase tracking-wider">Explore our latest heritage collections.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Shop the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-10">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Shopping Bag</p>
        <h1 className="mt-2 font-display text-display-lg font-bold text-ink">Your Cart</h1>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* Items List - Single-column list with thin dividers */}
        <div>
          <ul className="divide-y divide-ink/10 border-b border-ink/10">
            {cart.map((c) => {
              const src = c.imageUrl || placeholderImage(c.productId, c.productName, c.categoryName ?? "Boutique");
              return (
                <li key={c.variantId} className="flex gap-6 py-6 items-start">
                  <Link href={`/product/${c.productId}`} className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-paper-dark md:h-32 md:w-24">
                    <Image src={src} alt={c.productName} fill sizes="128px" className="object-cover" unoptimized />
                  </Link>
                  <div className="flex flex-1 flex-col h-full justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/product/${c.productId}`} className="font-display text-lg font-medium hover:text-maroon text-ink">
                          {c.productName}
                        </Link>
                        <button
                          onClick={() => startTransition(() => removeFromCartAction(c.variantId))}
                          disabled={pending}
                          className="rounded-full p-2 text-ink/40 hover:bg-maroon/10 hover:text-maroon transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {c.variantName && <p className="text-xs text-ink/60 font-mono uppercase tracking-wider mt-1">{c.variantName}</p>}
                      <p className="mt-1 text-[10px] text-ink/40 font-mono uppercase tracking-wider">Code: {c.productCode}</p>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-ink/10">
                        <button
                          onClick={() => startTransition(() => updateCartQuantityAction({ variantId: c.variantId, quantity: c.quantity - 1 }))}
                          disabled={pending || c.quantity <= 1}
                          className="rounded-l-full p-1.5 hover:bg-ink/5 disabled:opacity-30"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2.5rem] text-center text-xs font-mono font-semibold">{c.quantity}</span>
                        <button
                          onClick={() => startTransition(() => updateCartQuantityAction({ variantId: c.variantId, quantity: c.quantity + 1 }))}
                          disabled={pending}
                          className="rounded-r-full p-1.5 hover:bg-ink/5"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-mono text-sm font-semibold text-ink">
                        {formatPKR(Number(c.basePrice) * c.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Summary sticky right rail */}
        <aside className="h-fit rounded-md bg-paper p-6 border border-ink/5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-ink">Order Summary</h2>
          <dl className="mt-6 space-y-4 text-xs font-mono uppercase tracking-wider">
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink/50">Subtotal</dt>
              <dd className="font-semibold text-ink">{formatPKR(subtotal)}</dd>
            </div>
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink/50">Shipping</dt>
              <dd className="font-semibold text-ink">{shipping === 0 ? <span className="text-teal">Free</span> : formatPKR(shipping)}</dd>
            </div>
            <div className="flex justify-between pt-2">
              <dt className="text-ink/50">Total</dt>
              <dd className="font-display text-2xl font-bold text-ink normal-case font-sans">{formatPKR(total)}</dd>
            </div>
          </dl>

          <Link href="/checkout" className="btn-primary mt-8 w-full font-display">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="mt-4 block text-center text-xs uppercase tracking-widest text-ink/50 hover:text-ink font-mono">
            Continue Shopping
          </Link>

          <p className="mt-6 text-[10px] text-ink/40 text-center leading-relaxed font-mono uppercase tracking-wider">
            Final order confirmation is sent via WhatsApp. Payment is Cash on Delivery.
          </p>
        </aside>
      </div>
    </div>
  );
}
