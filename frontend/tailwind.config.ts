import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        card: "#1E293B",
        border: "#334155",
        "text-primary": "#F8FAFC",
        emerald: {
          DEFAULT: "#10B981",
          dark: "#059669",
        },
        amber: "#F59E0B",
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
