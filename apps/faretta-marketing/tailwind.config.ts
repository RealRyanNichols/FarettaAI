import type { Config } from "tailwindcss";

// Faretta palette — "Bright Sky + Glory Red". American, hopeful,
// innocent-until-proven-guilty. Pure white background, bright cobalt
// primary, bold flag red, warm gold, emerald for innocence/success.
//
//   paper       — pure white background (presumption of innocence)
//   parchment   — soft cream alt-surface
//   ink         — near-black text (slate-900)
//   sky         — bright cobalt — PRIMARY uplifting blue (CTAs)
//   liberty     — deep navy — brand depth, headlines, accents
//   flag/glory  — Glory red — confident accent / emphasis
//   gold        — warm gilt — justice, hope
//   emerald     — innocence / success / verdict
//
// Inter (sans) + Libre Caslon Text (serif) via Google Fonts; declared
// in app/layout.tsx. The serif carries the Faretta wordmark; the sans
// carries body and UI copy.

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        paper: "#FFFFFF",
        parchment: "#FAFAF8",
        "parchment-2": "#F1F5F9",

        // Text
        ink: "#0F172A",
        "ink-2": "#1E293B",
        mute: "#475569",
        "mute-2": "#94A3B8",

        // Primary — Bright Sky
        sky: "#3B82F6",
        "sky-deep": "#2563EB",
        "sky-soft": "#DBEAFE",

        // Brand depth — Liberty navy
        liberty: "#1E40AF",
        "liberty-deep": "#1E3A8A",
        "liberty-soft": "#DBEAFE",

        // Accent — Glory red. `flag` kept as alias for backwards-
        // compat utility-class usage already in pages.
        flag: "#EF4444",
        "flag-deep": "#DC2626",
        glory: "#EF4444",
        "glory-deep": "#DC2626",

        // Hope — gilt gold
        gold: "#F59E0B",
        "gold-soft": "#FDE68A",

        // Civic neutral
        eagle: "#475569",

        // Signals
        verdict: "#10B981",
        emerald: "#10B981",
        caution: "#F59E0B",
        objection: "#DC2626",
      },
      backgroundImage: {
        "f-dawn":     "linear-gradient(180deg,#FFFFFF 0%,#FAFAF8 100%)",
        "f-sky":      "linear-gradient(135deg,#3B82F6 0%,#2563EB 50%,#1E40AF 100%)",
        "f-liberty":  "linear-gradient(135deg,#1E40AF 0%,#2563EB 50%,#1E40AF 100%)",
        "f-wordmark": "linear-gradient(135deg,#1E40AF 0%,#3B82F6 35%,#F59E0B 65%,#EF4444 100%)",
        "f-stars":    "radial-gradient(rgba(59,130,246,0.10) 1px,transparent 1px)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["'Libre Caslon Text'", "Georgia", "serif"],
      },
      letterSpacing: {
        wordmark: "0.18em",
        kicker:   "0.2em",
        display:  "-0.02em",
      },
      borderRadius: {
        "f-primary":   "20px",
        "f-secondary": "12px",
        "f-card":      "16px",
      },
      transitionDuration: {
        hover: "120ms",
        press: "90ms",
      },
      maxWidth: {
        "f-content": "1120px",
        "f-prose":   "720px",
      },
      boxShadow: {
        "f-card": "0 8px 30px rgba(30,64,175,0.08)",
        "f-cta":  "0 12px 32px rgba(59,130,246,0.28)",
      },
    },
  },
};

export default config;
