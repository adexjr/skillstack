import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0B0D12",
          900: "#12151C",
          800: "#171A21",
          700: "#232732",
          600: "#333947",
        },
        mint: {
          400: "#7FFFB0",
          500: "#4FE39A",
        },
        coral: {
          400: "#FF7A6E",
          500: "#FF5C4D",
        },
        amber: {
          400: "#FFB84D",
          500: "#FF9E1F",
        },
        ink: {
          100: "#F4F6FA",
          300: "#B7BECC",
          500: "#7B8496",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(127,255,176,0.15), 0 0 24px rgba(127,255,176,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
