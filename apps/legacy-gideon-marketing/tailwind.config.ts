import type { Config } from "tailwindcss";
import farettaPreset from "@faretta/design-tokens/tailwind";

const config: Config = {
  presets: [farettaPreset as never],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
};

export default config;
