import type { Config } from "tailwindcss";

// Generate safelist patterns for AI-generated code in react-live.
// The reference files cover ~260 classes, but the AI may use others.
// These patterns ensure common utilities are always in the CSS bundle.
function generateSafelist(): string[] {
  const classes: string[] = [];

  // Spacing scale used across p, m, gap, space-y, etc.
  const spacings = [
    "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8",
    "9", "10", "11", "12", "14", "16", "20", "24", "28", "32",
  ];
  const spacingPrefixes = [
    "p", "px", "py", "pt", "pb", "pl", "pr",
    "m", "mx", "my", "mt", "mb", "ml", "mr",
    "gap", "space-y", "space-x",
  ];
  for (const prefix of spacingPrefixes) {
    for (const s of spacings) {
      classes.push(`${prefix}-${s}`);
    }
  }

  // Widths and heights
  const sizes = [
    "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8",
    "9", "10", "11", "12", "14", "16", "20", "24", "28", "32", "36", "40",
    "44", "48", "52", "56", "60", "64", "72", "80", "96",
    "full", "screen", "auto", "px",
    "1/2", "1/3", "2/3", "1/4", "3/4", "1/5", "2/5", "3/5", "4/5",
  ];
  for (const s of sizes) {
    classes.push(`w-${s}`, `h-${s}`);
  }
  for (const s of ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "full", "screen", "none"]) {
    classes.push(`max-w-${s}`);
  }
  classes.push("min-h-screen", "min-w-0");

  // Font sizes
  for (const s of ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"]) {
    classes.push(`text-${s}`);
  }

  // Font weight
  for (const w of ["thin", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"]) {
    classes.push(`font-${w}`);
  }

  // Rounded
  for (const r of ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"]) {
    classes.push(`rounded-${r}`);
  }
  classes.push("rounded");

  // Grid cols
  for (let i = 1; i <= 12; i++) {
    classes.push(`grid-cols-${i}`, `col-span-${i}`);
  }

  // Responsive prefixes for common utilities
  const breakpoints = ["sm", "md", "lg", "xl"];
  const responsiveClasses = [
    "block", "hidden", "flex", "grid", "inline-flex",
    "flex-row", "flex-col",
    "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4",
    "col-span-1", "col-span-2", "col-span-3",
    "items-center", "items-start",
    "gap-4", "gap-6", "gap-8",
    "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl",
    "w-1/2", "w-1/3", "w-2/3", "w-2/5", "w-3/5", "w-full", "w-auto",
    "px-4", "px-6", "px-8",
  ];
  for (const bp of breakpoints) {
    for (const cls of responsiveClasses) {
      classes.push(`${bp}:${cls}`);
    }
  }

  // Opacity
  for (const o of [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100]) {
    classes.push(`opacity-${o}`);
  }

  // Z-index
  for (const z of [0, 10, 20, 30, 40, 50]) {
    classes.push(`z-${z}`);
  }

  // Shadows
  for (const s of ["sm", "md", "lg", "xl", "2xl", "none"]) {
    classes.push(`shadow-${s}`);
  }
  classes.push("shadow");

  return classes;
}

const config: Config = {
  safelist: generateSafelist(),
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./examples/**/*.{js,ts,jsx,tsx,mdx}",
    "./references/**/*.{jsx,tsx,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      width: {
        sidebar: "var(--sidebar-width)",
      },
      padding: {
        sidebar: "var(--sidebar-width)",
      },
      fontSize: {
        h1: [
          "2.25rem",
          { lineHeight: "2.5rem", fontWeight: "700" },
        ],
        h2: [
          "1.875rem",
          { lineHeight: "2.25rem", fontWeight: "600" },
        ],
        h3: [
          "1.5rem",
          { lineHeight: "2rem", fontWeight: "600" },
        ],
        body: [
          "1rem",
          { lineHeight: "1.5rem", fontWeight: "400" },
        ],
        small: [
          "0.875rem",
          { lineHeight: "1.25rem", fontWeight: "400" },
        ],
        tiny: [
          "0.75rem",
          { lineHeight: "1rem", fontWeight: "400" },
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
