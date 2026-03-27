import type { AppLocale } from '@/app/store'

import { MINUTE } from './system'

type CountryItem = {
  code: string
  name: string
}

const COUNTRY_CONFIG = {
  TH: { name: 'Thailand', currency: 'THB', locale: 'th-TH' },
  US: { name: 'United States', currency: 'USD', locale: 'en-US' },
  GR: { name: 'Greece', currency: 'EUR', locale: 'el-GR' },
  IT: { name: 'Italy', currency: 'EUR', locale: 'it-IT' },
  NL: { name: 'Netherlands', currency: 'EUR', locale: 'nl-NL' },
  MY: { name: 'Malaysia', currency: 'MYR', locale: 'ms-MY' },
  SG: { name: 'Singapore', currency: 'SGD', locale: 'en-SG' },
  JP: { name: 'Japan', currency: 'JPY', locale: 'ja-JP' },
  CN: { name: 'China', currency: 'CNY', locale: 'zh-CN' },
  IS: { name: 'Iceland', currency: 'ISK', locale: 'is-IS' },
  VN: { name: 'Vietnam', currency: 'VND', locale: 'vi-VN' },
  ID: { name: 'Indonesia', currency: 'IDR', locale: 'id-ID' },
} as const

const COUNTRIES: CountryItem[] = Object.entries(COUNTRY_CONFIG).map(
  ([code, { name }]) => ({ code, name }),
)

const DEFAULT_APP_LOCALE = 'th'
const DEFAULT_CURRENCY_CODE = 'THB' as const

const CURRENCY = {
  DEFAULT_CODE: DEFAULT_CURRENCY_CODE,
  DEFAULT_LOCALE: 'th-TH',
  EXCHANGE_API_THB: `https://open.er-api.com/v6/latest/${DEFAULT_CURRENCY_CODE}`,
  CACHE_TTL: 15 * MINUTE,
} as const

const CURRENCY_LOCALE_MAP = Object.entries(COUNTRY_CONFIG).map(
  ([country, { currency, locale }]) => ({
    country,
    currency,
    locale,
  }),
)

const SUPPORTED_APP_LOCALES = Array.from(
  new Set(CURRENCY_LOCALE_MAP.map((i) => i.country.toLowerCase())),
) as readonly string[]

const DEFAULT_COUNTRY_CODE = DEFAULT_APP_LOCALE.toUpperCase()
const DEFAULT_COUNTRY =
  COUNTRY_CONFIG[DEFAULT_COUNTRY_CODE as keyof typeof COUNTRY_CONFIG]

const DEFAULT_LOCALE: AppLocale = {
  country: DEFAULT_COUNTRY_CODE,
  currency: CURRENCY.DEFAULT_CODE,
  locale: CURRENCY.DEFAULT_LOCALE,
  name: DEFAULT_COUNTRY?.name ?? 'Thailand',
}

export {
  CURRENCY_LOCALE_MAP,
  CURRENCY,
  COUNTRY_CONFIG,
  COUNTRIES,
  SUPPORTED_APP_LOCALES,
  DEFAULT_LOCALE,
  DEFAULT_APP_LOCALE,
}
export type { CountryItem }
