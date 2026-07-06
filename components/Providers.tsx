"use client";

import { SessionProvider } from "next-auth/react";
import SmoothScroll from "@/components/motion/SmoothScroll";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SmoothScroll />
      {children}
    </SessionProvider>
  );
}
