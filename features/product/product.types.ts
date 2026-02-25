import type { getProduct, getProductsInfinite } from './product.action'
import type { Prisma } from '@prisma/client'

type DecimalOrNumber = number | Prisma.Decimal

type GetProductResult = Awaited<ReturnType<typeof getProduct>>
type GetProductsInfiniteResult = Awaited<ReturnType<typeof getProductsInfinite>>

interface UseProductParams {
  locale: string
  slug: string
  userId?: string
  initialData?: GetProductResult
}

interface UseProductsParams {
  locale: string
  itemsPerPage: number
  initialData?: GetProductsInfiniteResult
}

interface UseProductPriceParams {
  price: number
  priceMin: number | null
  priceMax: number | null
}

interface UseSimilarProductsParams {
  locale: string
  categoryId?: string | null
  excludeProductId?: string
  limit?: number
}

interface PriceBase {
  price: DecimalOrNumber
  salePrice?: DecimalOrNumber | null
}

interface ProductVariant extends PriceBase {
  id?: string
  name?: string
  stockQuantity?: number
}

interface ProductWithVariants extends PriceBase {
  id?: string
  name?: string
  variants?: ProductVariant[] | null
}

interface PriceInfo {
  price: number
  originalPrice: number
  discountAmount: number
  discountPercentage: number
  hasDiscount: boolean
}

export type {
  DecimalOrNumber,
  GetProductResult,
  GetProductsInfiniteResult,
  UseProductParams,
  UseProductsParams,
  UseProductPriceParams,
  UseSimilarProductsParams,
  PriceBase,
  ProductVariant,
  ProductWithVariants,
  PriceInfo,
}
