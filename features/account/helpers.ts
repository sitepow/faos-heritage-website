import type { GetAddressResult } from '@/app/(main)/account/store'

export const getFullAddress = (address: GetAddressResult) => {
  if (!address) return 'The shipping address is unknown.'

  const {
    name,
    address: addr,
    subDistrict,
    district,
    province,
    country,
    postalCode,
    phone,
  } = address

  return [
    name && `Shipping name. ${name}`,
    addr && `House number ${addr}`,
    subDistrict && `district ${subDistrict}`,
    district && `district ${district}`,
    province && `province ${province}`,
    country && `country ${country}`,
    postalCode && `zip code ${postalCode}`,
    phone && `phone ${phone}`,
  ]
    .filter(Boolean)
    .join(' ')
}
