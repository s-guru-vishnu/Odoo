/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#714B67", // Deep Plum
          foreground: "#FFFFFF",
          hover: "#5a3b52", // Darker shade
          light: "#9A7E92",
        },
        secondary: {
          DEFAULT: "#475569", // Slate Gray
          foreground: "#FFFFFF",
        },
        accent: {
          mustard: "#E3B341", // Mustard Yellow
          sky: "#38BDF8", // Sky Blue
          teal: "#14B8A6", // Teal / Seafoam
        },
        neutral: {
          50: "#F9FAFB", // Off-white
          100: "#F3F4F6",
          200: "#E5E7EB",
          800: "#1F2937",
          900: "#111827",
        },
        module: {
          crm: "#3B82F6", // Blue
          inventory: "#F97316", // Orange
          finance: "#8B5CF6", // Purple
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        handwriting: ["'Architects Daughter'", "cursive"],
        cursive: ["'Patrick Hand'", "cursive"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "draw": "draw 1s ease-out forwards",
        "lift": "lift 0.3s ease-out forwards",
      },
      keyframes: {
        draw: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        lift: {
          "0%": { transform: "translateY(0)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
          "100%": { transform: "translateY(-4px)", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
        }
      }
    },
  },
  plugins: [],
}

