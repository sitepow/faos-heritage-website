import type { getProduct, getProductsInfinite } from './product.action'

type GetProductResult = Awaited<ReturnType<typeof getProduct>>
type GetProductsInfiniteResult = Awaited<ReturnType<typeof getProductsInfinite>>

interface UseProductParams {
  locale: string
  productId: string
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

export type {
  GetProductResult,
  GetProductsInfiniteResult,
  UseProductParams,
  UseProductsParams,
  UseProductPriceParams,
  UseSimilarProductsParams,
}
