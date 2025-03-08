/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          black: "#1a1a1a",
          orange: "#ff6a00",
          gold: "#ffb400",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "#e0e0e0",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "#10b981", // Green 500
          light: "#34d399", // Green 400
          dark: "#059669", // Green 600
        },
        warning: {
          DEFAULT: "#f59e0b", // Amber 500
          light: "#fbbf24", // Amber 400
          dark: "#d97706", // Amber 600
        },
        info: {
          DEFAULT: "#3b82f6", // Blue 500
          light: "#60a5fa", // Blue 400
          dark: "#2563eb", // Blue 600
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(255, 106, 0, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(255, 106, 0, 0.8), 0 0 30px rgba(255, 106, 0, 0.4)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.secondary.light"),
            a: {
              color: theme("colors.primary.orange"),
              "&:hover": {
                color: theme("colors.primary.gold"),
              },
            },
            h1: {
              color: theme("colors.secondary.light"),
            },
            h2: {
              color: theme("colors.secondary.light"),
            },
            h3: {
              color: theme("colors.secondary.light"),
            },
            h4: {
              color: theme("colors.secondary.light"),
            },
            code: {
              color: theme("colors.primary.orange"),
              backgroundColor: theme("colors.primary.black"),
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
              border: "1px solid rgba(255, 106, 0, 0.2)",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: theme("colors.primary.black"),
              color: theme("colors.secondary.light"),
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

