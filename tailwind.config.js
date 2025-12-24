import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sukhumvit)'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.default.700'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                opacity: 0.8,
              },
            },
            h1: { color: theme('colors.default.900') },
            h2: { color: theme('colors.default.900') },
            h3: { color: theme('colors.default.900') },
            strong: { color: theme('colors.default.900') },
            code: {
              backgroundColor: theme('colors.default.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.default.200'),
            h1: { color: theme('colors.default.50') },
            h2: { color: theme('colors.default.50') },
            h3: { color: theme('colors.default.50') },
            strong: { color: theme('colors.default.50') },
            code: {
              backgroundColor: theme('colors.default.800'),
            },
          },
        },
      }),
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: '#F0C808',
            secondary: '#1B4332',
          },
        },
        dark: {
          colors: {
            primary: '#F0C808',
            secondary: '#1B4332',
          },
        },
      },
    }),
    require('@tailwindcss/typography'),
  ],
}

module.exports = config
