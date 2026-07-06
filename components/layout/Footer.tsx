import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import Marquee from "@/components/motion/Marquee";

type HQ = {
  locationName?: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
};

export default function Footer({
  storeName,
  footerMessage,
  location,
}: {
  storeName: string;
  footerMessage: string;
  location: HQ | null;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 bg-ink text-paper">
      {/* Marquee Strip above the footer */}
      <Marquee
        items={["VELVET", "SILK", "CHIFFON", "LAWN", "HERITAGE", "LAHORE"]}
        speed={40}
        className="border-y border-paper/10 py-6 bg-ink text-paper"
        itemClassName="font-display uppercase tracking-widest text-paper/80 text-xl md:text-2xl"
      />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr]">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block relative h-20 w-20 md:h-28 md:w-28">
              <Image
                src="/logo_transparent.png"
                alt="HIT by Huma logo"
                fill
                sizes="120px"
                className="object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="max-w-xs text-xs md:text-sm text-paper/70 font-sans leading-relaxed">
              {footerMessage}
            </p>
            {/* Urdu heritage block */}
            <div className="pt-2">
              <span className="font-urdu text-3xl text-saffron block leading-relaxed" dir="rtl">
                ہٹ باۓ ہما
              </span>
            </div>
            
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="Instagram" className="rounded-full border border-paper/20 p-2 hover:bg-paper/10 text-paper transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full border border-paper/20 p-2 hover:bg-paper/10 text-paper transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${process.env.WHATSAPP_NUMBER ?? ""}`}
                aria-label="WhatsApp"
                className="rounded-full border border-paper/20 p-2 hover:bg-paper/10 text-paper transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron font-mono">Shop</h4>
            <ul className="mt-4 space-y-2.5 text-xs md:text-sm font-sans">
              <li><Link href="/shop" className="text-paper/70 hover:text-paper transition-colors">All Products</Link></li>
              <li><Link href="/shop/lawn" className="text-paper/70 hover:text-paper transition-colors">Lawn</Link></li>
              <li><Link href="/shop/velvet-dress" className="text-paper/70 hover:text-paper transition-colors">Velvet</Link></li>
              <li><Link href="/shop/chiffon" className="text-paper/70 hover:text-paper transition-colors">Chiffon</Link></li>
              <li><Link href="/shop/raw-silk" className="text-paper/70 hover:text-paper transition-colors">Raw Silk</Link></li>
              <li><Link href="/shop/unstitched" className="text-paper/70 hover:text-paper transition-colors">Unstitched</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron font-mono">Help</h4>
            <ul className="mt-4 space-y-2.5 text-xs md:text-sm font-sans">
              <li><Link href="/account" className="text-paper/70 hover:text-paper transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="text-paper/70 hover:text-paper transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="text-paper/70 hover:text-paper transition-colors">Cart</Link></li>
              <li><Link href="/about" className="text-paper/70 hover:text-paper transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Visit Us */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron font-mono">Visit Us</h4>
            <ul className="mt-4 space-y-2.5 text-xs md:text-sm text-paper/70 font-sans">
              {location?.address && (
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron" />
                  <span>{location.address}{location.city ? `, ${location.city}` : ""}</span>
                </li>
              )}
              {location?.phone && (
                <li className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron" />
                  <a href={`tel:${location.phone}`} className="hover:text-paper transition-colors">{location.phone}</a>
                </li>
              )}
              {location?.email && (
                <li className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron" />
                  <a href={`mailto:${location.email}`} className="hover:text-paper transition-colors break-all">{location.email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron font-mono">Newsletter</h4>
            <p className="mt-4 text-xs md:text-sm text-paper/70 font-sans leading-relaxed">
              Subscribe for early access, private sales, and storytelling.
            </p>
            <form className="mt-4 flex max-w-sm border-b border-paper/30 py-1">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-transparent text-xs md:text-sm text-paper placeholder:text-paper/40 focus:outline-none"
              />
              <button type="submit" className="font-display italic text-saffron hover:text-white text-xs md:text-sm font-semibold whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-8 text-xs text-paper/40 md:flex-row font-mono">
          <p>© {year} {storeName}. All rights reserved.</p>
          <p className="font-display italic text-sm text-paper/60 uppercase tracking-widest">Draped in Heritage</p>
        </div>
      </div>
    </footer>
  );
}
