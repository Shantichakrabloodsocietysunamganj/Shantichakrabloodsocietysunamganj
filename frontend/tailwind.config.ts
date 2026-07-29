import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Primary Blue (brand) — #0B4F9C
        brand: {
          50: "#eef5fc",
          100: "#d6e6f8",
          200: "#aecdf1",
          300: "#7eafe6",
          400: "#4a8cd6",
          500: "#256fc0",
          600: "#0b4f9c", // PRIMARY BLUE
          700: "#093f7d",
          800: "#083b73", // DARK BLUE
          900: "#062b56",
          950: "#041a36",
        },
        // Blood Red (accent) — #D62828
        blood: {
          50: "#fdecec",
          100: "#fbd0d0",
          200: "#f7a5a5",
          300: "#f07575",
          400: "#e74b4b",
          500: "#d62828", // PRIMARY RED
          600: "#bf2020",
          700: "#a61e1e", // DARK RED
          800: "#841515",
          900: "#630e0e",
          950: "#3e0707",
        },
        success: {
          50: "#ecfdf3",
          100: "#d1fadf",
          500: "#16a34a",
          600: "#12a045",
          700: "#0c7d38",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
        },
        canvas: "#F5F7FA",
        ink: "#1F2937",
      },
      fontFamily: {
        sans: ["Hind Siliguri", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Hind Siliguri", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(16 24 40 / 0.05)",
        card: "0 1px 3px 0 rgb(16 24 40 / 0.06), 0 10px 30px -12px rgb(16 24 40 / 0.12)",
        glow: "0 12px 40px -8px rgb(11 79 156 / 0.35)",
        "glow-red": "0 12px 40px -8px rgb(214 40 40 / 0.35)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.8s infinite linear",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
