import { auth } from "@/lib/auth";
import { getCart } from "@/lib/actions/cart";
import { findCustomerById } from "@/lib/db/queries/customers";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  const cart = await getCart().catch(() => []);
  const customer = session?.user?.customerId ? await findCustomerById(session.user.customerId).catch(() => null) : null;

  return (
    <CheckoutClient
      cart={cart as any}
      defaultAddress={customer?.address}
      defaultCity={customer?.city}
      isLoggedIn={!!session?.user}
    />
  );
}
