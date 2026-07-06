"use client";

import { cn } from "@/lib/utils";

/**
 * Marquee — infinite horizontal ticker. Pure CSS animation; lightweight and
 * respects prefers-reduced-motion (animation pauses).
 *
 *   <Marquee items={["VELVET", "SILK", "LAWN", ...]} />
 */
export default function Marquee({
  items,
  separator = "·",
  speed = 40, // seconds per loop
  reverse = false,
  className,
  itemClassName,
}: {
  items: string[];
  separator?: string;
  speed?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  // Duplicate the items to make a seamless loop
  const all = [...items, ...items];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden whitespace-nowrap",
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          "inline-flex items-center gap-6 will-change-transform",
          reverse ? "animate-marquee-rev" : "animate-marquee"
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {all.map((item, i) => (
          <span
            key={i}
            className={cn(
              "inline-flex items-center gap-6 font-display text-2xl md:text-3xl lg:text-4xl",
              itemClassName
            )}
          >
            <span>{item}</span>
            <span className="opacity-40">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
