import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, Globe, Users } from "lucide-react";
import { ABOUT_HERO_IMAGE, ABOUT_EDITORIAL_IMAGE, placeholderImage } from "@/lib/placeholders";
import StickySection from "@/components/motion/StickySection";
import TextReveal from "@/components/motion/TextReveal";
import Parallax from "@/components/motion/Parallax";

export const metadata = { title: "About" };

const VALUES = [
  { icon: Heart, title: "Made with Love", body: "Every piece is hand-finished. Every order is packed with care.", img: placeholderImage(1, "Love", "Boutique") },
  { icon: Sparkles, title: "Heritage Fabrics", body: "Velvet, raw silk, chiffon, lawn — sourced from Pakistan's finest mills.", img: placeholderImage(2, "Fabric", "Boutique") },
  { icon: Users, title: "Fair Trade", body: "We pay our artisans 2x the market rate. Always.", img: placeholderImage(3, "Artisans", "Boutique") },
  { icon: Globe, title: "Shipped Worldwide", body: "From Lahore to London, Karachi to Toronto. We deliver.", img: placeholderImage(4, "Worldwide", "Boutique") },
];

export default function AboutPage() {
  return (
    <>
      {/* Editorial Hero */}
      <section className="relative -mt-20 flex h-[75vh] min-h-[550px] items-center justify-center overflow-hidden text-ivory">
        <div className="absolute inset-0">
          <Image
            src={ABOUT_HERO_IMAGE.src}
            alt="Pakistani textile heritage"
            fill
            sizes="100vw"
            className="object-cover hero-img-zoom"
            unoptimized
            priority
          />
        </div>
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute inset-0 noise-bg" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-saffron">Our Heritage</p>
          <h1 className="font-display text-display-xl font-bold leading-[0.95] text-pretty">
            <TextReveal trigger="mount" by="word" delay={0.1}>Crafted in Pakistan. Worn with pride.</TextReveal>
          </h1>
        </div>
      </section>

      {/* Sticky Story section */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36 border-b border-ink/10">
        <StickySection
          sticky={
            <div className="space-y-6 md:pr-8">
              <h2 className="font-display text-display-md font-bold italic text-maroon leading-tight">
                "HIT BY HUMA is a love letter to the women who weave Pakistan's soul into cloth."
              </h2>
              {/* Urdu decorative accent */}
              <div className="pt-2">
                <span className="font-urdu text-4xl text-saffron block leading-relaxed" dir="rtl">
                  ہٹ باۓ ہما
                </span>
              </div>
            </div>
          }
        >
          <div className="space-y-8 text-base md:text-lg leading-relaxed text-ink/75 font-sans">
            <p>
              We started in 2025 in a small studio in Model Town, Lahore, with a single velvet kaftan
              and a stubborn belief: that the most beautiful clothes in the world are still being made
              by hand, on wooden looms, in workshops most of the country has forgotten.
            </p>
            <p>
              Every piece you find here comes directly from the artisans who make them — the
              embroiderers of Multan, the silk weavers of Bhawalpur, the gota workers of Hyderabad.
              No middlemen, no markups, no shortcuts.
            </p>
            <p>
              We're a small team with big ambitions: to put Pakistani couture on the global map,
              one hand-stitched dupatta at a time.
            </p>
          </div>
        </StickySection>
      </section>

      {/* Editorial image cover */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="relative aspect-[21/9] overflow-hidden rounded-md shadow-xl bg-paper-dark">
          <Parallax speed={-0.05} className="absolute inset-0 h-full w-full">
            <Image
              src={ABOUT_EDITORIAL_IMAGE.src}
              alt="Embroidered fabric — close-up"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
              unoptimized
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-paper md:bottom-10 md:left-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-saffron">Our Vocation</p>
            <p className="mt-2 font-display text-2xl md:text-3xl font-medium tracking-wide">
              Every thread is a story. Every stitch is a signature.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid 2x2 with Hover thumbnails */}
      <section className="bg-paper py-24 lg:py-32 border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Philosophy</p>
            <h2 className="mt-2 font-display text-display-md font-bold text-ink">Core Convictions</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="group relative rounded-md bg-paper-dark border border-ink/5 p-8 flex gap-6 overflow-hidden items-start transition-colors hover:bg-paper-dark/80"
              >
                <div className="flex-1 space-y-3">
                  <div className="rounded-full bg-maroon/10 p-3 text-maroon w-fit">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink">{v.title}</h3>
                  <p className="text-sm text-ink/75 leading-relaxed">{v.body}</p>
                </div>
                
                {/* Floating hover thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-ink/10 opacity-0 scale-95 translate-x-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0">
                  <Image src={v.img} alt={v.title} fill className="object-cover" unoptimized />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="font-display text-display-md font-bold text-ink">Come visit us.</h2>
        <p className="mt-3 text-ink/60 font-mono text-sm uppercase tracking-wider">Model Town, Lahore — by appointment.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Shop the Collection
        </Link>
      </section>
    </>
  );
}
