import type { Config } from "tailwindcss";
import gideonPreset from "@gideon/design-tokens/tailwind";

const config: Config = {
  presets: [gideonPreset as never],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
};

export default config;
