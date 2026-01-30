import type { GetProductResult } from '@/features/product/product.action'

import { IMAGE_FALLBACK } from '@/constants'

const getBackgroundStyle = (image: string) => {
  return {
    backgroundImage: `
      linear-gradient(
        to right,
        rgba(0,0,0,0.8),
        rgba(0,0,0,0.4)
      ),
      url(${image})
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

const resolveProductImages = (product: GetProductResult) => {
  const images = product?.images ?? []

  const primary = images.find((img) => img.isPrimary) ?? images[0] ?? null

  const hover = images.find((img) => !img.isPrimary) ?? primary

  return {
    primarySrc: primary?.url ?? IMAGE_FALLBACK.EMPTY,
    hoverSrc: hover?.url ?? IMAGE_FALLBACK.EMPTY,
  }
}

export { getBackgroundStyle, resolveProductImages }
