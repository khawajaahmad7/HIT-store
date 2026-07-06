"use client";

import { motion } from "framer-motion";

export default function PoetryBlock() {
  return (
    <section className="relative bg-ink text-paper py-24 lg:py-32 overflow-hidden border-t border-b border-paper/10">
      {/* Decorative background calligraphy watermark */}
      <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center pointer-events-none select-none">
        <span className="font-urdu text-[30vw] whitespace-nowrap leading-none">
          ہنرمند
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: English Translation / Editorial Description */}
          <div className="order-2 lg:order-1 space-y-6 max-w-lg">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-saffron">
              [ Kalaam / کلام ]
            </p>
            <blockquote className="space-y-4">
              <p className="font-display text-2xl md:text-3xl italic text-paper-dark leading-relaxed">
                "We gave the garments of beauty the color of grace;
                we poured our hearts into every single pattern we trace."
              </p>
              <footer className="font-mono text-xs uppercase tracking-widest text-paper/40">
                — A Tribute to the Artisans of Lahore
              </footer>
            </blockquote>
            <p className="text-sm text-paper/60 leading-relaxed font-sans pt-4 border-t border-paper/10">
              Each garment at Hit by Huma is more than fabric—it is a physical poem,
              knotted by hand, woven on wooden looms, and detailed with gold threads
              that have spoken the same language of elegance for generations.
            </p>
          </div>

          {/* Right Column: Urdu Calligraphy Couple (RTL) */}
          <div className="order-1 lg:order-2 text-right space-y-6 lg:pl-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
              dir="rtl"
            >
              <p className="font-urdu text-3xl md:text-4xl lg:text-5xl text-saffron leading-[2.4] md:leading-[2.6] tracking-wide">
                لباسِ حسن کو بخشا ہے ہم نے رنگِ وفا <br />
                کہ ہر ایک نقش میں ہم نے دل کا خوں ڈالا
              </p>
              <div className="h-[1px] w-24 bg-saffron/30 mr-0 ml-auto" />
              <p className="font-mono text-xs uppercase tracking-widest text-paper/30">
                شاعر نامعلوم
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
