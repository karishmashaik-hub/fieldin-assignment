import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        emerald: {
          DEFAULT: "rgb(var(--color-emerald) / <alpha-value>)",
          dark: "rgb(var(--color-emerald-dark) / <alpha-value>)",
        },
        amber: "rgb(var(--color-amber) / <alpha-value>)",
      },
      borderRadius: {
        "2xl": "16px",
      },
      spacing: {
        "1u": "8px",
        "2u": "16px",
        "3u": "24px",
        "4u": "32px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
