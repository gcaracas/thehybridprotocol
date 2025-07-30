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
        // The Hybrid Protocol Brand Colors
        'protocol': {
          'dark-green': '#1c2a1d',
          'olive': '#6c7b42', 
          'sage': '#f2f0eb',
          'golden': '#e6b800',
          'off-white': '#fbfaf5',
        },
        // Gradients and variations
        'green': {
          900: '#1c2a1d',
          700: '#6c7b42',
          100: '#f2f0eb',
        },
        'yellow': {
          500: '#e6b800',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1c2a1d 0%, #2a3e2b 50%, #6c7b42 100%)',
        'sage-gradient': 'linear-gradient(to bottom, #fbfaf5 0%, #f2f0eb 100%)',
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