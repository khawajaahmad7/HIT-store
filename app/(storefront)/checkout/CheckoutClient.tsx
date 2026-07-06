"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageCircle, MapPin, Loader2 } from "lucide-react";
import { placeOrderAction } from "@/lib/actions/cart";
import { formatPKR } from "@/lib/currency";
import Link from "next/link";
import type { CartLine } from "@/lib/actions/cart";

export default function CheckoutClient({
  cart,
  defaultAddress,
  defaultCity,
  isLoggedIn,
}: {
  cart: CartLine[];
  defaultAddress?: string | null;
  defaultCity?: string | null;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ saleNumber: string; whatsappUrl: string } | null>(null);

  const subtotal = cart.reduce((s, c) => s + Number(c.basePrice) * c.quantity, 0);
  const shipping = subtotal >= 15000 ? 0 : 250;
  const total = subtotal + shipping;

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await placeOrderAction({
        address: String(formData.get("address") ?? ""),
        city: String(formData.get("city") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      });
      if (!res.ok) {
        setError(res.error ?? "Failed to place order");
        return;
      }
      setSuccess({ saleNumber: res.saleNumber!, whatsappUrl: res.whatsappUrl! });
      // Open WhatsApp in new tab
      if (res.whatsappUrl) window.open(res.whatsappUrl, "_blank");
      // Redirect to order page after a moment
      setTimeout(() => router.push(`/orders?sale=${res.saleId}`), 2000);
    });
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-20 text-center">
        <h1 className="font-display text-display-md font-bold text-ink">Cart is empty</h1>
        <Link href="/shop" className="btn-primary mt-6">Continue Shopping</Link>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-6 pt-32 pb-20 text-center">
        <h1 className="font-display text-display-md font-bold text-ink">Sign in to checkout</h1>
        <p className="mt-3 text-ink/60">Create an account or sign in to complete your order. Your cart is saved.</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href={`/login?return=/checkout`} className="btn-primary">Sign In</Link>
          <Link href={`/register?return=/checkout`} className="btn-ghost">Create Account</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-20 text-center bg-ivory">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal text-ivory">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="mt-8 font-display text-display-md font-bold text-ink">Order placed!</h1>
        <p className="mt-2 text-lg text-ink/60">Order #{success.saleNumber}</p>
        <p className="mt-6 text-ink/75">
          We've opened WhatsApp to confirm your order with the store.
          If it didn't open, <a href={success.whatsappUrl} className="text-maroon link-underline font-semibold">tap here</a>.
        </p>
        <Link href={`/orders`} className="btn-primary mt-8">View My Orders</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-10">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Secure Order</p>
        <h1 className="mt-2 font-display text-display-lg font-bold text-ink">Checkout</h1>
      </div>

      <form action={onSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          {/* Delivery */}
          <section>
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-maroon" />
              <h2 className="font-display text-3xl font-bold text-ink">Delivery Details.</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">Delivery Address</label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  defaultValue={defaultAddress ?? ""}
                  placeholder="House/Flat, Street, Area, City"
                  className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm focus:border-ink focus:outline-none rounded-none text-ink placeholder:text-ink/30 font-sans"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">City</label>
                <input
                  name="city"
                  type="text"
                  required
                  defaultValue={defaultCity ?? ""}
                  placeholder="Lahore, Karachi, Islamabad…"
                  className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm focus:border-ink focus:outline-none rounded-none text-ink placeholder:text-ink/30 font-sans"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">Order notes (optional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Delivery instructions, gift message…"
                  className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm focus:border-ink focus:outline-none rounded-none text-ink placeholder:text-ink/30 font-sans"
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="pt-6 border-t border-ink/10">
            <h2 className="font-display text-3xl font-bold text-ink mb-6">Payment.</h2>
            <div className="mt-4 flex items-center gap-3 border border-saffron/35 bg-saffron/5 p-4 rounded-md">
              <div className="rounded-full bg-saffron p-2 text-ink">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">Cash on Delivery</p>
                <p className="text-xs text-ink/65 leading-relaxed mt-0.5">Pay in cash when your order arrives at your doorstep.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Summary side column */}
        <aside className="h-fit rounded-md bg-paper p-6 border border-ink/5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-ink mb-6">Your Order</h2>
          <ul className="space-y-3 text-xs font-mono uppercase tracking-wider">
            {cart.map((c) => (
              <li key={c.variantId} className="flex justify-between gap-3 border-b border-ink/5 pb-2">
                <span className="text-ink/75 truncate max-w-[200px]">
                  {c.productName}{c.variantName ? ` (${c.variantName})` : ""} × {c.quantity}
                </span>
                <span className="font-semibold text-ink">{formatPKR(Number(c.basePrice) * c.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 text-xs font-mono uppercase tracking-wider">
            <div className="flex justify-between border-b border-ink/5 pb-2"><dt className="text-ink/50">Subtotal</dt><dd className="font-semibold text-ink">{formatPKR(subtotal)}</dd></div>
            <div className="flex justify-between border-b border-ink/5 pb-2"><dt className="text-ink/50">Shipping</dt><dd className="font-semibold text-ink">{shipping === 0 ? <span className="text-teal">Free</span> : formatPKR(shipping)}</dd></div>
            <div className="flex justify-between pt-2">
              <dt className="text-ink/50">Total</dt>
              <dd className="font-display text-2xl font-bold text-ink normal-case font-sans">{formatPKR(total)}</dd>
            </div>
          </dl>

          {error && (
            <p className="mt-4 rounded bg-maroon/10 px-3 py-2 text-xs font-mono uppercase tracking-wider text-maroon text-center">{error}</p>
          )}

          <button type="submit" disabled={pending} className="btn-primary mt-8 w-full font-display">
            {pending ? (
              <><Loader2 className="h-4 w-4 animate-spin animate-pulse" /> Placing Order…</>
            ) : (
              <><MessageCircle className="h-4 w-4" /> Place Order via WhatsApp</>
            )}
          </button>
          <p className="mt-4 text-center text-[10px] text-ink/40 leading-relaxed font-mono uppercase tracking-wider">
            By placing your order, you agree to receive a WhatsApp confirmation from HIT BY HUMA.
          </p>
        </aside>
      </form>
    </div>
  );
}
