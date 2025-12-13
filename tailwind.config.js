/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zone1': '#90EE90',
        'zone2': '#00BFFF',
        'zone3': '#32CD32',
        'zone4': '#FFD700',
        'zone5': '#FF6347',
        'zone6': '#FF0000',
        'strength': '#9370DB',
        'rest': '#E0E0E0',
      },
    },
  },
  plugins: [],
}
