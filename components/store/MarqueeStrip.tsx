"use client";

import Marquee from "@/components/motion/Marquee";

export default function MarqueeStrip() {
  return (
    <Marquee
      items={["VELVET", "SILK", "CHIFFON", "LAWN", "HERITAGE", "LAHORE"]}
      speed={35}
      className="border-y border-ink/10 py-6 bg-paper text-ink"
      itemClassName="font-display uppercase tracking-[0.2em] text-ink/80 text-xl md:text-2xl"
    />
  );
}
