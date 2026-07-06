import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // HIT BY HUMA brand palette
        maroon: {
          DEFAULT: "#7B1E3A",
          50: "#FBEEF0",
          100: "#F4D5DB",
          200: "#E5A0AE",
          300: "#D26B81",
          400: "#C14059",
          500: "#7B1E3A",
          600: "#681830",
          700: "#501224",
          800: "#380C18",
          900: "#20070E",
        },
        saffron: {
          DEFAULT: "#F5C543",
          50: "#FDFDF0",
          100: "#FDF0CC",
          200: "#FAE099",
          300: "#FAD16B",
          400: "#F7C952",
          500: "#F5C543",
          600: "#D6A327",
          700: "#A87D17",
          800: "#7A590F",
          900: "#4D3605",
        },
        teal: {
          DEFAULT: "#0F6E6E",
          50: "#E0F2F2",
          100: "#B0DCDC",
          200: "#80C6C6",
          300: "#50B0B0",
          400: "#2A9999",
          500: "#0F6E6E",
          600: "#0A5757",
          700: "#084040",
          800: "#052929",
          900: "#021313",
        },
        ivory: {
          DEFAULT: "#FBF6EE",
          50: "#FEFDFB",
          100: "#FBF6EE",
          200: "#F5ECDC",
          300: "#ECDEC0",
          400: "#DDC79C",
          500: "#C7AB75",
        },
        paper: {
          DEFAULT: "#F5F0E6",
          dark: "#EAE2D1",
        },
        ink: {
          DEFAULT: "#0E0E0E",
          soft: "#1A1A1A",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        urdu: ["var(--font-noto-nastaliq)", "serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Editorial scale — tight, refined, fashion-magazine
        "display-2xl": ["clamp(4.5rem, 11vw, 9rem)", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
        "display-xl":  ["clamp(3.25rem, 7vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-lg":  ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-md":  ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm":  ["clamp(1.375rem, 2vw, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        // Body tightening
        base: ["0.9375rem", { lineHeight: "1.6" }],
        sm:   ["0.8125rem", { lineHeight: "1.55" }],
        xs:   ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Marquee scrolls the inner track left by exactly half its width (which
        // is duplicated content), giving a seamless loop.
        "marquee-x": {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-x-reverse": {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "text-rise": {
          "0%":   { transform: "translateY(110%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "0.8" },
        },
        "scale-line": {
          "0%":   { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 12s ease infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "shimmer": "shimmer 2.4s linear infinite",
        "marquee": "marquee-x 40s linear infinite",
        "marquee-rev": "marquee-x-reverse 40s linear infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "scale-line": "scale-line 1.4s cubic-bezier(0.2,0.8,0.2,1) forwards",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #7B1E3A 0%, #E0A526 35%, #0F6E6E 70%, #7B1E3A 100%)",
        "brand-radial":
          "radial-gradient(circle at 30% 20%, rgba(224,165,38,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(15,110,110,0.18) 0%, transparent 50%)",
        "marquee-fade":
          "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
      },
      letterSpacing: {
        widest2: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
