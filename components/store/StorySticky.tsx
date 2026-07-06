"use client";

import Image from "next/image";
import Link from "next/link";
import StickySection from "@/components/motion/StickySection";
import Parallax from "@/components/motion/Parallax";
import { STORY_IMAGE } from "@/lib/placeholders";

export default function StorySticky() {
  return (
    <section className="bg-ink text-paper py-24 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <StickySection
          sticky={
            <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-md shadow-2xl bg-zinc-900">
              <Parallax speed={-0.08} className="absolute inset-0 h-full w-full">
                <Image
                  src={STORY_IMAGE.src}
                  alt="Pakistani heritage craft"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </Parallax>
              <div className="absolute bottom-4 left-4 right-4 bg-ink/75 backdrop-blur-md p-4 text-[10px] font-mono tracking-[0.25em] text-paper uppercase flex justify-between rounded">
                <span>LHR · EST 2025</span>
                <span>01 / Heritage</span>
              </div>
            </div>
          }
          className="items-center"
        >
          <div className="space-y-8 lg:space-y-12 py-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-saffron">Our Story</p>
              <h2 className="mt-4 font-display text-display-xl font-bold leading-tight">
                Born in Lahore, <br />
                <span className="text-saffron">worn everywhere.</span>
              </h2>
            </div>
            <div className="space-y-6 font-sans text-base md:text-lg text-paper/85 leading-relaxed">
              <p>
                HIT BY HUMA celebrates the craft of Pakistani couture — the velvet of Multan,
                the silk of Bhawalpur, the gota of Hyderabad. Every piece is hand-finished by
                artisans who carry generations of knowledge in their fingertips.
              </p>
              <p>
                We work directly with weavers and embroiderers, skipping the middlemen so the
                people who make your clothes are paid fairly — and so you can wear heritage
                without the heritage price tag.
              </p>
              <p>
                Each collection is a curated dialogue between history and contemporary silhouette,
                crafted in limited batches to minimize waste and ensure absolute focus on detail.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 font-display text-lg font-semibold tracking-wider text-saffron transition-transform hover:translate-x-1"
              >
                <span className="link-underline">Read Our Full Story</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </StickySection>
      </div>
    </section>
  );
}
