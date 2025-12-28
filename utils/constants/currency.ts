export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_LOCALE = 'en-US'

export const COUNTRY_CURRENCY_MAP = {
  TH: 'THB',
  US: 'USD',
  GR: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  IS: 'ISK',
  MY: 'MYR',
  SG: 'SGD',
  JP: 'JPY',
  CN: 'CNY',
  VN: 'VND',
  ID: 'IDR',
} as const

export const CURRENCY_LOCALE_MAP: Record<string, string> = {
  USD: 'en-US',
  THB: 'th-TH',
  JPY: 'ja-JP',
  EUR: 'de-DE',
  GBP: 'en-GB',
  SGD: 'en-SG',
  MYR: 'ms-MY',
  CNY: 'zh-CN',
  VND: 'vi-VN',
  IDR: 'id-ID',
}
