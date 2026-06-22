import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#f4f4f5",
        card: {
          DEFAULT: "#14141f",
          hover: "#1a1a28",
        },
        accent: {
          blue: "#3b82f6",
          violet: "#8b5cf6",
          emerald: "#10b981",
          cyan: "#06b6d4",
        },
        border: "rgba(255, 255, 255, 0.08)",
        muted: {
          DEFAULT: "#71717a",
          foreground: "#a1a1aa",
        },
      },
      borderRadius: {
        card: "24px",
        button: "16px",
        panel: "28px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(59, 130, 246, 0.15)",
        "glow-violet": "0 0 40px rgba(139, 92, 246, 0.2)",
        "glow-emerald": "0 0 40px rgba(16, 185, 129, 0.2)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.08) 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
