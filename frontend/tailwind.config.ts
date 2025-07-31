import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Earth Tone Color Palette
        'warm': {
          'cream': '#f9f7f3',
          'beige': '#f1ede6',
          'tan': '#e8ddc7',
        },
        'earth': {
          'brown': '#8b4513',
          'dark': '#5d2f0a',
          'green': '#7a8471',
          'sage': '#9ca986',
        },
        'accent': {
          'gold': '#d4af37',
        },
        // Legacy support
        'protocol': {
          'dark-green': '#5d2f0a',
          'olive': '#7a8471', 
          'sage': '#f1ede6',
          'golden': '#d4af37',
          'off-white': '#f9f7f3',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #f9f7f3 0%, #f1ede6 50%, #e8ddc7 100%)',
        'warm-gradient': 'linear-gradient(to bottom, #f9f7f3 0%, #f1ede6 100%)',
        'earth-gradient': 'linear-gradient(135deg, #8b4513 0%, #7a8471 100%)',
      },
      boxShadow: {
        'wellness': '0 10px 40px rgba(28, 42, 29, 0.1)',
        'card-hover': '0 20px 60px rgba(108, 123, 66, 0.2)',
      }
    },
  },
  plugins: [],
});

export default config;