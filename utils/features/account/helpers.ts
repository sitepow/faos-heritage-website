import type { GetAddressResult } from '@/app/(main)/account/action'

export const getFullAddress = (address: GetAddressResult) => {
  if (!address) return 'The shipping address is unknown.'

  const {
    name,
    address: streetAddress,
    subDistrict,
    district,
    province,
    country,
    postalCode,
    phone,
  } = address

  const lines = []

  if (name) lines.push(name)
  if (streetAddress) lines.push(streetAddress)

  if (subDistrict) lines.push(subDistrict)
  if (district) lines.push(district)
  if (province) lines.push(province)

  if (postalCode) lines.push(postalCode)

  if (country) lines.push(country)

  let result = lines.join(', ')

  if (phone) result += `. Phone: ${phone}`

  return result
}
