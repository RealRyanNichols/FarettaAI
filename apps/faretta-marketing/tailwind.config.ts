import type { Config } from "tailwindcss";

// Faretta palette — American, hopeful, light. Distinct from Gideon's
// dark/bronze/biblical theme. No dark backgrounds.
//   parchment: warm cream — primary background
//   paper:     pure white surface
//   ink:       soft near-black — primary text
//   liberty:   American navy — primary accent / CTA
//   flag:      American red — secondary accent / emphasis
//   gold:      gilt — "justice" accent
//
// Reuses Inter via Google Fonts (declared in app/layout.tsx). Type scale
// and spacing are local because Faretta's mark and rhythm differ from Gideon.

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#FBF7EE",
        "parchment-2": "#F3EBD6",
        paper: "#FFFFFF",
        ink: "#1A2332",
        "ink-2": "#4A5468",
        mute: "#6B7280",
        "mute-2": "#94A3B8",
        liberty: "#1E3A8A",
        "liberty-deep": "#142659",
        "liberty-soft": "#DBE4F4",
        flag: "#B91C1C",
        "flag-deep": "#8B0F0F",
        gold: "#C8941A",
        "gold-soft": "#F3DDA0",
        eagle: "#475569",
        verdict: "#047857",
        caution: "#B45309",
        objection: "#B91C1C",
      },
      backgroundImage: {
        "f-dawn": "linear-gradient(180deg,#FFFFFF 0%,#FBF7EE 100%)",
        "f-liberty": "linear-gradient(135deg,#1E3A8A 0%,#1E40AF 50%,#1E3A8A 100%)",
        "f-wordmark": "linear-gradient(135deg,#1E3A8A 0%,#C8941A 50%,#B91C1C 100%)",
        "f-stars": "radial-gradient(rgba(30,58,138,0.10) 1px,transparent 1px)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["'Libre Caslon Text'", "Georgia", "serif"],
      },
      letterSpacing: {
        wordmark: "0.18em",
        kicker: "0.2em",
        display: "-0.02em",
      },
      borderRadius: {
        "f-primary": "20px",
        "f-secondary": "12px",
        "f-card": "16px",
      },
      transitionDuration: {
        hover: "120ms",
        press: "90ms",
      },
      maxWidth: {
        "f-content": "1120px",
        "f-prose": "720px",
      },
      boxShadow: {
        "f-card": "0 8px 30px rgba(30,58,138,0.08)",
        "f-cta": "0 12px 32px rgba(30,58,138,0.20)",
      },
    },
  },
};

export default config;
