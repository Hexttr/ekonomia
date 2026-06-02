import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-onest)", "system-ui", "sans-serif"],
        brand: ["var(--font-unbounded)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#34d399",
          "green-dim": "#10b981",
          red: "#ef4444",
        },
        surface: {
          DEFAULT: "#1c2129",
          elevated: "#161a21",
        },
      },
      boxShadow: {
        fab: "0 8px 28px rgba(16, 185, 129, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
