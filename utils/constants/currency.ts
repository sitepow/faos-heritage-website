export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_LOCALE = 'en-US'

export const EXCHANGE_RATE_API = 'https://open.er-api.com/v6/latest/USD'

export const CURRENCY_LOCALE_MAP = [
  {
    country: 'TH',
    currency: 'THB',
    name: 'Thailand',
    locale: 'th-TH',
  },
  {
    country: 'US',
    currency: 'USD',
    name: 'United States',
    locale: 'en-US',
  },
  {
    country: 'GR',
    currency: 'EUR',
    name: 'Greece',
    locale: 'el-GR',
  },
  {
    country: 'IT',
    currency: 'EUR',
    name: 'Italy',
    locale: 'it-IT',
  },
  {
    country: 'NL',
    currency: 'EUR',
    name: 'Netherlands',
    locale: 'nl-NL',
  },
  {
    country: 'MY',
    currency: 'MYR',
    name: 'Malaysia',
    locale: 'ms-MY',
  },
  {
    country: 'SG',
    currency: 'SGD',
    name: 'Singapore',
    locale: 'en-SG',
  },
  {
    country: 'JP',
    currency: 'JPY',
    name: 'Japan',
    locale: 'ja-JP',
  },
  {
    country: 'CN',
    currency: 'CNY',
    name: 'China',
    locale: 'zh-CN',
  },
  {
    country: 'IS',
    currency: 'ISK',
    name: 'Iceland',
    locale: 'is-IS',
  },
  {
    country: 'VN',
    currency: 'VND',
    name: 'Vietnam',
    locale: 'vi-VN',
  },
  {
    country: 'ID',
    currency: 'IDR',
    name: 'Indonesia',
    locale: 'id-ID',
  },
] as const

export const LOCALES = Array.from(
  new Set(CURRENCY_LOCALE_MAP.map((item) => item.country.toLowerCase())),
) as readonly string[]
