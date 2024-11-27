/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'send-msg': '#FF6B6B',
        'receive-msg': '#4ECDC4',
      },
    },
  },
  plugins: [],
}