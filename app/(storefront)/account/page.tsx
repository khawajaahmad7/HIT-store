import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { findCustomerById } from "@/lib/db/queries/customers";
import { formatPKR } from "@/lib/currency";
import { Mail, Phone, MapPin, Award, Wallet } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?return=/account");
  const customer = await findCustomerById(session.user.customerId).catch(() => null);
  if (!customer) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20 lg:px-10">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Portal</p>
        <h1 className="mt-2 font-display text-display-lg font-bold text-ink">My Account</h1>
        <p className="mt-2 text-sm text-ink/60">Welcome back, {customer.firstName}.</p>
      </div>

      {/* Loyalty, Wallet, and Spent rows */}
      <div className="mt-10 grid gap-8 border-y border-ink/10 py-8 md:grid-cols-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Loyalty Points</p>
          <p className="mt-2 font-display text-5xl font-bold text-ink">{customer.loyaltyPoints ?? 0}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Wallet Balance</p>
          <p className="mt-2 font-display text-5xl font-bold text-ink">{formatPKR(customer.walletBalance ?? 0)}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Total Spent</p>
          <p className="mt-2 font-display text-5xl font-bold text-ink">{formatPKR(customer.totalPurchases ?? 0)}</p>
          <p className="mt-1 text-[10px] text-ink/40 font-mono uppercase tracking-wider">Across {customer.visitCount ?? 0} visits</p>
        </div>
      </div>

      <div className="mt-10 rounded-md bg-paper p-6 border border-ink/5">
        <h2 className="font-display text-2xl font-bold text-ink mb-4">Profile Details</h2>
        <dl className="mt-4 space-y-4 text-sm font-sans text-ink/80">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-ink/40" />
            <span>{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-ink/40" />
              <span>{customer.email}</span>
            </div>
          )}
          {customer.address && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink/40" />
              <span>{customer.address}{customer.city ? `, ${customer.city}` : ""}</span>
            </div>
          )}
        </dl>
      </div>

      <form action={logoutAction} className="mt-8">
        <button type="submit" className="btn-ghost font-mono text-xs uppercase tracking-widest px-6 py-2.5">Sign Out</button>
      </form>
    </div>
  );
}
