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
      fontSize: {
        // Bolder, tighter display scale for artistic headings
        "display-sm": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-lg": ["3.75rem", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "800" }],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(16 24 40 / 0.05)",
        card: "0 1px 2px 0 rgb(16 24 40 / 0.04), 0 12px 32px -14px rgb(16 24 40 / 0.14)",
        "card-hover": "0 1px 2px 0 rgb(16 24 40 / 0.04), 0 22px 48px -16px rgb(11 79 156 / 0.22)",
        glow: "0 14px 44px -10px rgb(11 79 156 / 0.38)",
        "glow-red": "0 14px 44px -10px rgb(214 40 40 / 0.38)",
        glass: "0 8px 32px -8px rgb(16 24 40 / 0.18)",
        "inner-line": "inset 0 1px 0 0 rgb(255 255 255 / 0.6)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #093f7d 0%, #0b4f9c 38%, #256fc0 70%, #d62828 145%)",
        "blood-gradient": "linear-gradient(135deg, #d62828 0%, #bf2020 55%, #841515 120%)",
        "mesh-light":
          "radial-gradient(at 12% 8%, rgba(37,111,192,0.12) 0px, transparent 50%), radial-gradient(at 88% 4%, rgba(214,40,40,0.10) 0px, transparent 45%), radial-gradient(at 70% 92%, rgba(11,79,156,0.10) 0px, transparent 50%)",
        "shine": "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.55) 50%, transparent 75%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.75rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translate3d(0, 18px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "panel-in": {
          "0%": { opacity: "0", transform: "translate3d(0, 10px, 0) scale(0.985)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0) scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-ring": {
          "0%": { transform: "translateZ(0) scale(0.9)", opacity: "0.7" },
          "100%": { transform: "translateZ(0) scale(1.8)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "gradient-pan": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "aurora": {
          "0%,100%": { transform: "translate3d(0,0,0) rotate(0deg) scale(1)" },
          "50%": { transform: "translate3d(2%, -3%, 0) rotate(8deg) scale(1.08)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "panel-in": "panel-in 0.42s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 1.8s infinite linear",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 30s linear infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "aurora": "aurora 18s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
