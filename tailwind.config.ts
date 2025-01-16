/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: '#37169c',
  				'50': '#f3f2ff',
  				'100': '#e9e8ff',
  				'200': '#d5d4ff',
  				'300': '#b7b1ff',
  				'400': '#9285ff',
  				'500': '#6f53ff',
  				'600': '#5c30f7',
  				'700': '#4e1ee3',
  				'800': '#4118bf',
  				'900': '#37169c',
  				'950': '#1f0b6a'
  			},
  			black: '#000000',
  			secondary: {
  				'100': '#E2E2D5',
  				'200': '#888883'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwind-scrollbar"), require("tailwindcss-animate")],
} satisfies Config;
