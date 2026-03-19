/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        slate: {
          50: '#faf7f3',
          100: '#f2f2f2',
          200: '#e7ddd3',
          300: '#d5c1ae',
          400: '#bf9b7a',
          500: '#988271',
          600: '#727273',
          700: '#6c5847',
          800: '#503b29',
          900: '#3b2a1e',
          950: '#24180f',
        },
        brand: {
          50: '#fff4e6',
          100: '#ffe5c2',
          200: '#ffd19a',
          300: '#f8b866',
          400: '#f6a335',
          500: '#f28c0f',
          600: '#d97706',
          700: '#8c4e03',
          800: '#733e03',
          900: '#5d3205',
          950: '#341a01',
        },
        accent: {
          DEFAULT: '#bf9b7a',
          light: '#d2b496',
          dark: '#9a7656',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
