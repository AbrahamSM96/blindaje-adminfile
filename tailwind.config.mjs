import animations from '@midudev/tailwind-animations'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)'
      },
      animation: {
        flip: 'flip 6s infinite steps(2, end)',
        rotate: 'rotate 3s linear infinite both'
      },
      keyframes: {
        flip: {
          to: {
            transform: 'rotate(360deg)'
          }
        },
        rotate: {
          to: {
            transform: 'rotate(90deg)'
          }
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [
    animations,
    function ({ addVariant }) {
      addVariant('any-hover', '@media (any-hover: hover) { &:hover }')
    }
  ]
}
