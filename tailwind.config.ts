import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gen-Z aesthetic color palette
        primary: {
          pink: '#FF8FBA',
          'pink-light': '#FFB2D4',
          'pink-dark': '#FF4D8D',
        },
        secondary: {
          purple: '#9B59B6',
          'purple-light': '#E1BEE7',
        },
        accent: {
          cyan: '#00F5FF',
          'cyan-dark': '#00D4FF',
        },
        dark: {
          pink: '#FF1493',
          purple: '#8B008B',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #FF4D8D, #FF8FBA)',
        'gradient-hero': 'linear-gradient(135deg, #FF8FBA, #FFB2D4)',
        'gradient-purple': 'linear-gradient(135deg, #9B59B6, #E1BEE7)',
      },
    },
  },
  plugins: [],
};
export default config;
