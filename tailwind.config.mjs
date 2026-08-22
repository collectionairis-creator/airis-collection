/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        airi: {
          white: '#FFFFFF',
          rose: '#E8A6AE',
          roseLight: '#FBE4E7',
          black: '#111111',
          gold: '#C9A45C',
          beige: '#F6F0EA',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};