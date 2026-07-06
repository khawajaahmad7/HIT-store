import CartClient from "./CartClient";
import { getCart } from "@/lib/actions/cart";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  let cart: Awaited<ReturnType<typeof getCart>> = [];
  try {
    cart = await getCart();
  } catch (err) {
    console.warn("[/cart] DB not ready:", err);
  }
  return <CartClient cart={cart as any} />;
}
