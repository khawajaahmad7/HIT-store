"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Parallax — moves a child element at a different rate than the page scroll.
 * Positive `speed` makes the element move up faster (relative to the page).
 *
 *   <Parallax speed={-0.3}><Image .../></Parallax>
 */
export default function Parallax({
  children,
  speed = -0.2,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref as any,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}px`, `${-speed * 100}px`]);

  const MotionTag = motion(Tag) as any;

  return (
    <MotionTag ref={ref as any} className={cn("relative", className)}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </MotionTag>
  );
}
