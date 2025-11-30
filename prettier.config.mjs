/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  arrowParens: 'always',
  endOfLine: 'lf',
  printWidth: 100,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,

  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],

  tailwindFunctions: ['cva', 'cn', 'cx'],
  tailwindStylesheet: './styles/globals.css',

  importOrder: [
    '^react$',
    '^next',
    '^next/(.*)$',
    '',
    '^@/components/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/styles/(.*)$',
    '',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}

export default config
