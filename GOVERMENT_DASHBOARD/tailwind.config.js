/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        government: {
          50: '#f0f5fa',
          100: '#e1ebf4',
          200: '#c5d9eb',
          300: '#9bc0de',
          400: '#6ca1cd',
          500: '#4a85b9',
          600: '#386a9a',
          700: '#2e557d',
          800: '#284868',
          900: '#243e56',
          950: '#172739',
        },
        risk: {
          normal: '#22c55e', // green-500
          low: '#eab308',    // yellow-500
          high: '#f97316',   // orange-500
          critical: '#ef4444', // red-500
        }
      },
    },
  },
  plugins: [],
}
