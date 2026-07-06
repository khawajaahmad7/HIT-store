"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const HERO_SLIDES = [
  {
    id: "/hero_slide_1.png",
    collection: "Velvet Couture '26",
    title: "AUTUMN VELVET",
    subtitle: "Exquisite hand-crafted embroidery on premium micro-velvet.",
  },
  {
    id: "/hero_slide_2.png",
    collection: "Bridal & Festive",
    title: "ROYAL HERITAGE",
    subtitle: "Traditional silhouettes crafted for the timeless woman.",
  },
  {
    id: "/hero_slide_3.png",
    collection: "Premium Karandi",
    title: "LAHORE LOOMS",
    subtitle: "Intricate threadwork woven into historical textures.",
  },
  {
    id: "/hero_slide_4.png",
    collection: "Gota Kinari Duaptta",
    title: "SILK JAAL",
    subtitle: "Rich gold threadwork set against luxury boutique weaves.",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative -mt-20 flex h-[100svh] min-h-[700px] w-full items-center justify-start overflow-hidden text-ivory">
      {/* Slideshow Images */}
      {HERO_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === active ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <Image
            src={slide.id}
            alt={slide.title}
            fill
            sizes="100vw"
            className={`object-cover transition-transform duration-[5000ms] ease-out ${
              idx === active ? "scale-105" : "scale-100"
            }`}
            priority={idx === 0}
          />
          {/* Heavy editorial dark overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 noise-bg opacity-[0.02]" />

      {/* Floating Orbs for extra premium styling */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-saffron/10 blur-3xl animate-pulse duration-10000" />
      <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-teal/10 blur-3xl animate-pulse duration-10000" />

      {/* Content Content (Left-aligned for a magazine editorial look) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl text-left">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-saffron font-semibold">
            ✦ {HERO_SLIDES[active].collection} ✦
          </p>
          <h1 className="font-display text-5xl font-bold leading-[0.95] text-paper md:text-7xl lg:text-8xl tracking-tight uppercase transition-all duration-700">
            {HERO_SLIDES[active].title}
          </h1>
          <p className="mt-4 font-display text-xl italic text-paper-dark md:text-2xl">
            Hit by Huma
          </p>
          <p className="mt-6 max-w-lg text-sm md:text-base leading-relaxed text-paper-dark/80 font-sans">
            {HERO_SLIDES[active].subtitle}
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-gold font-display font-bold uppercase tracking-widest text-xs px-8 py-3">
              Shop the Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-paper/40 bg-paper/5 px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-all hover:bg-paper hover:text-ink"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators / Progress lines at the bottom */}
      <div className="absolute bottom-10 left-6 right-6 lg:left-10 lg:right-10 z-15 flex items-center gap-3">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className="group flex-1 py-3 focus:outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div className="h-[2px] w-full bg-paper/20 overflow-hidden relative rounded-full">
              <div
                className={`h-full bg-saffron absolute left-0 top-0 transition-all ${
                  idx === active ? "w-full duration-[5000ms] ease-linear" : "w-0 duration-0"
                }`}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
