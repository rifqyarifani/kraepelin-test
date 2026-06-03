import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: "#4096FF",
        ink: "#121212",
        score: "#2563EB",
        "success-bg": "#F0FDF4",
        "success-fg": "#166534",
        "danger-bg": "#FEF2F2",
        "danger-fg": "#991B1B",
        "info-bg": "#EFF6FF",
        "info-fg": "#1E40AF",
        "violet-bg": "#F5F3FF",
        "violet-fg": "#5B21B6",
        "gold-bg": "#FEF9C3",
        "gold-fg": "#854D0E",
        "bronze-bg": "#FEF3F2",
        "bronze-fg": "#B42318",
        "border-soft": "#E5E7EB",
      },
    },
  },
  plugins: [],
} satisfies Config;
