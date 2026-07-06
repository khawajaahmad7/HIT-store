"use client";

import { motion, useInView } from "framer-motion";
import { Children, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * StaggerReveal — fades children in one by one on viewport entry.
 * Each direct child must be a single React element (wrap fragments in <div>).
 *
 *   <StaggerReveal>
 *     <Card />
 *     <Card />
 *     <Card />
 *   </StaggerReveal>
 */
export default function StaggerReveal({
  children,
  className,
  delay = 0,
  staggerChildren = 0.08,
  y = 24,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  y?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref as any}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren, delayChildren: delay },
        },
      }}
    >
      {Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
