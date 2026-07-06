"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/lawn", label: "Lawn" },
  { href: "/shop/velvet-dress", label: "Velvet" },
  { href: "/about", label: "About" },
];

function HoverReveal({ children }: { children: string }) {
  const letters = children.split("");
  return (
    <motion.span
      className="relative inline-flex overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      <span className="sr-only">{children}</span>
      <span className="flex overflow-hidden">
        {letters.map((char, idx) => (
          <motion.span
            key={idx}
            variants={{
              initial: { y: 0 },
              hover: { y: "-100%" },
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
              delay: idx * 0.015,
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
      <span className="absolute inset-0 flex overflow-hidden">
        {letters.map((char, idx) => (
          <motion.span
            key={idx}
            variants={{
              initial: { y: "100%" },
              hover: { y: 0 },
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
              delay: idx * 0.015,
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}

export default function Navbar({ storeName = "HIT BY HUMA" }: { storeName?: string }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      if (window.scrollY > 10) {
        setShowAnnouncement(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnnouncement(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent text-ivory"
          : "bg-ivory/95 text-ink backdrop-blur-md shadow-sm"
      )}
    >
      {/* Top thin accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-maroon origin-left z-50"
      />

      {/* Slim Announcement Bar */}
      <div
        className={cn(
          "bg-ink text-paper text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center transition-all duration-500 ease-in-out overflow-hidden",
          showAnnouncement ? "h-9 opacity-100" : "h-0 opacity-0 pointer-events-none"
        )}
      >
        <span>Free shipping over PKR 15,000</span>
      </div>

      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 transition-all duration-500",
          scrolled ? "h-16" : "h-20"
        )}
      >
        {/* Logo (Mark only) */}
        <Link href="/" className="flex items-center gap-3" aria-label={storeName}>
          <span className="relative h-18 w-18 flex-shrink-0 md:h-24 md:w-24">
            <Image
              src="/logo_transparent.png"
              alt="HIT by Huma logo"
              fill
              sizes="96px"
              className={cn(
                "object-contain transition-all duration-300",
                transparent ? "brightness-0 invert" : ""
              )}
              priority
            />
          </span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-xs uppercase tracking-[0.2em] transition-colors relative pb-1",
                pathname === l.href ? "opacity-100 font-semibold" : "opacity-75 hover:opacity-100"
              )}
            >
              <HoverReveal>{l.label}</HoverReveal>
              {pathname === l.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-current"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Icons / Search inline */}
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 p-1 hover:opacity-80 transition-opacity"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline font-mono text-xs uppercase tracking-widest">Search</span>
          </button>

          <Link
            href="/cart"
            aria-label="Cart"
            className="rounded-full p-2 transition-colors hover:bg-black/5"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
          {session?.user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/account"
                className="rounded-full p-2 transition-colors hover:bg-black/5"
                aria-label="Account"
              >
                <User className="h-4 w-4" />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-mono text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full p-2 transition-colors hover:bg-black/5 md:block"
              aria-label="Login"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
          <button
            className="rounded-full p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-ink/10 bg-ivory text-ink md:hidden">
          <nav className="flex flex-col px-6 py-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b border-ink/10 py-4 text-base uppercase tracking-widest"
              >
                {l.label}
              </Link>
            ))}
            {session?.user ? (
              <>
                <Link href="/account" className="border-b border-ink/10 py-4 text-base uppercase tracking-widest">
                  Account
                </Link>
                <Link href="/orders" className="border-b border-ink/10 py-4 text-base uppercase tracking-widest">
                  My Orders
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="py-4 text-left text-base uppercase tracking-widest text-maroon"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="border-b border-ink/10 py-4 text-base uppercase tracking-widest">
                  Login
                </Link>
                <Link href="/register" className="py-4 text-base uppercase tracking-widest text-maroon">
                  Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 z-50 bg-ivory text-ink px-6 py-6 shadow-lg border-b border-ink/10"
          >
            <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative flex items-center">
                  <Search className="absolute left-0 h-5 w-5 text-ink/40" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by collection, fabric, or keyword..."
                    className="w-full bg-transparent border-b border-ink/20 pl-8 pr-4 py-3 text-lg focus:outline-none focus:border-ink font-display"
                  />
                </div>
              </form>
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-full p-2 hover:bg-ink/5 transition-colors"
                aria-label="Close search"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
