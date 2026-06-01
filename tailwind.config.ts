import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        "primary-light": "#1e293b",
        "primary-lighter": "#334155",
        accent: "#2563eb",
        "accent-light": "#3b82f6",
        "accent-lighter": "#60a5fa",
        secondary: "#06b6d4",
        "secondary-light": "#22d3ee",
        "secondary-lighter": "#a5f3fc",
        success: "#10b981",
        warning: "#f59e0b",
        alert: "#ef4444",
        muted: "#4b5563",
        faint: "#6b7280",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,.05)",
        sm: "0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)",
        md: "0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)",
        lg: "0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)",
        xl: "0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)",
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
        slideUp: "slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(16px)", opacity: "0" },
          to: { transform: "none", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
