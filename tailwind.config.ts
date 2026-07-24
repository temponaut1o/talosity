import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#0f172a',
          600: '#0d1929',
          700: '#0b101e',
          900: '#050812',
        },
      },
    },
  },
  plugins: [],
}
export default config
