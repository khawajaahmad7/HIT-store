"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * TextReveal — animates text on viewport entry. By default it splits per-word
 * and reveals each word with an upward mask. Set `by="letter"` for fine
 * per-letter reveals (Dribbble staple).
 *
 *   <TextReveal>Drape in Heritage.</TextReveal>
 *   <TextReveal by="letter" className="font-display text-display-xl">Draped</TextReveal>
 */
export default function TextReveal({
  children,
  by = "word",
  className,
  delay = 0,
  staggerChildren = 0.06,
  as: Tag = "span",
  trigger = "view", // "view" = on viewport entry, "mount" = on mount
  once = true,
}: {
  children: string;
  by?: "word" | "letter";
  className?: string;
  delay?: number;
  staggerChildren?: number;
  as?: keyof JSX.IntrinsicElements;
  trigger?: "view" | "mount";
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });

  const tokens: string[] =
    by === "word"
      ? children.split(/(\s+)/) // keep spaces
      : Array.from(children);

  const variants = {
    hidden: { y: "110%" },
    visible: (i: number) => ({
      y: "0%",
      transition: {
        delay: delay + i * staggerChildren,
        duration: 0.9,
        ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
      },
    }),
  };

  const animateState = trigger === "mount" || inView ? "visible" : "hidden";

  const MotionTag = motion(Tag) as any;

  return (
    <MotionTag
      ref={ref as any}
      className={cn("inline-block", className)}
      aria-label={children}
    >
      {tokens.map((t, i) =>
        /^\s+$/.test(t) ? (
          <span key={i}>{t}</span>
        ) : (
          <span
            key={i}
            className="inline-block overflow-hidden align-baseline"
            aria-hidden
          >
            <motion.span
              className="inline-block"
              custom={i}
              variants={variants}
              initial="hidden"
              animate={animateState}
            >
              {t}
            </motion.span>
          </span>
        )
      )}
    </MotionTag>
  );
}
