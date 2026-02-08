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

interface ResolveProductimagesProps {
  images?: { url: string; isPrimary: boolean }[]
}

const resolveProductImages = ({ images }: ResolveProductimagesProps = {}) => {
  const safeImages = Array.isArray(images) ? images : []

  const primary =
    safeImages.find((img) => img.isPrimary) ?? safeImages[0] ?? safeImages[0]
  const hover = safeImages.find((img) => !img.isPrimary) ?? primary

  return {
    primarySrc: primary?.url ?? IMAGE_FALLBACK.EMPTY,
    hoverSrc: hover?.url ?? IMAGE_FALLBACK.EMPTY,
  }
}

export { getBackgroundStyle, resolveProductImages }
