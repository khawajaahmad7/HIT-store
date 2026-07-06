import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Nastaliq_Urdu, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import { getSettings, getHeadquartersLocation } from "@/lib/db/queries/products";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const noto = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-noto-nastaliq",
  display: "swap",
  weight: ["400", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let storeName = "HIT BY HUMA";
  try {
    const settings = await getSettings();
    if (settings.company_name) storeName = settings.company_name.toUpperCase();
  } catch {
    // ignore — DB not ready
  }
  return {
    title: { default: `${storeName} — Draped in Heritage`, template: `%s · ${storeName}` },
    description: "Pakistani boutique — velvet kaftans, raw silk, chiffon, lawn. Hand-picked, hand-crafted, hand-delivered.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings: Record<string, string> = {};
  let hq: { locationName?: string; address?: string | null; city?: string | null; phone?: string | null; email?: string | null } | null = null;
  try {
    settings = await getSettings();
    hq = await getHeadquartersLocation();
  } catch {
    // ignore — DB not ready during build
  }

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${noto.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-ivory text-ink antialiased font-sans tracking-tight">
        <Providers>
          <Navbar storeName={settings.company_name ?? "HIT BY HUMA"} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer
            storeName={settings.company_name ?? "HIT BY HUMA"}
            footerMessage={settings.receipt_footer ?? "Thank you for shopping with us!"}
            location={hq}
          />
        </Providers>
      </body>
    </html>
  );
}
