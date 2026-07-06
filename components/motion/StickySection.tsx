"use client";

import { cn } from "@/lib/utils";

/**
 * StickySection — two-column layout where the LEFT column sticks while the
 * RIGHT column scrolls past. Used for editorial "story" sections.
 *
 *   <StickySection
 *     sticky={<h2 className="font-display">Heritage</h2>}
 *   >
 *     <p>paragraphs…</p>
 *   </StickySection>
 */
export default function StickySection({
  sticky,
  children,
  className,
  stickyClassName,
  topOffset = "top-24",
}: {
  sticky: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  stickyClassName?: string;
  topOffset?: string;
}) {
  return (
    <div className={cn("grid gap-10 md:grid-cols-2 md:gap-16", className)}>
      <div className={cn("md:sticky md:self-start", topOffset, stickyClassName)}>
        {sticky}
      </div>
      <div>{children}</div>
    </div>
  );
}
