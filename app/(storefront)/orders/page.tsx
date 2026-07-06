import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrdersForCustomer } from "@/lib/db/queries/sales";
import { formatPKR } from "@/lib/currency";
import Link from "next/link";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?return=/orders");

  const orders = await getOrdersForCustomer(session.user.customerId).catch(() => []);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20 lg:px-10">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">History</p>
        <h1 className="mt-2 font-display text-display-lg font-bold text-ink">My Orders</h1>
        <p className="mt-2 text-sm text-ink/60">Track your HIT BY HUMA purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-16 rounded-md border border-dashed border-ink/20 p-16 text-center bg-paper">
          <Package className="mx-auto h-10 w-10 text-ink/30" />
          <h2 className="mt-6 font-display text-xl font-bold text-ink">No orders yet</h2>
          <p className="mt-2 text-sm text-ink/50 font-mono uppercase tracking-wider">When you place your first order, it'll show up here.</p>
          <Link href="/shop" className="btn-primary mt-6">Start Shopping</Link>
        </div>
      ) : (
        <div className="relative border-l border-ink/10 pl-6 ml-4 space-y-12 mt-10">
          {orders.map((o) => (
            <div key={o.saleId} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-ink border-2 border-paper" />
              
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/5 pb-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-ink/40">Order #{o.saleNumber}</p>
                  <p className="mt-1 text-xs text-ink/60 font-mono">
                    Placed on{" "}
                    {new Date(o.createdAt as any).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <span className={`mt-2 inline-block rounded px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest ${
                    o.status === "delivered" ? "bg-teal/10 text-teal" :
                    o.status === "shipped" ? "bg-saffron/20 text-saffron-700" :
                    o.status === "cancelled" ? "bg-maroon/10 text-maroon" :
                    "bg-ink/10 text-ink/60"
                  }`}>
                    {o.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-ink/40">Total</p>
                  <p className="font-display text-xl font-bold text-ink">{formatPKR(o.totalAmount ?? 0)}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-xs font-mono uppercase tracking-wider text-ink/75">
                {o.items.map((it) => (
                  <li key={it.saleItemId} className="flex justify-between border-b border-ink/5 pb-1">
                    <span>
                      {it.productName}{it.variantName ? ` (${it.variantName})` : ""} × {it.quantity}
                    </span>
                    <span className="font-semibold text-ink">{formatPKR(it.lineTotal ?? 0)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
