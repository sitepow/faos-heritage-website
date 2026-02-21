'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type {
  ProductWithVariants,
  UseProductParams,
  UseProductsParams,
  UseSimilarProductsParams,
} from './product.types'

import { getProduct, getProductsInfinite } from './product.action'
import { productQueryKeys } from './product.query-key'
import { useExchangeRate } from '../exchangeRate/useExchangeRate'

import { PAGINATION } from '@/constants'
import { formatCurrency, formatCurrencyRange } from '@/utils/number'
import { getProductPriceInfo } from '@/utils/productPrice'

const useProduct = ({
  locale,
  productId,
  userId,
  initialData,
}: UseProductParams) => {
  return useQuery({
    queryKey: productQueryKeys.details.byId(productId, { locale, userId }),
    queryFn: () => getProduct(productId, locale),
    initialData,
    staleTime: 0,
    enabled: !!productId,
  })
}

const useProducts = ({
  locale,
  itemsPerPage,
  initialData,
}: UseProductsParams) => {
  return useQuery({
    queryKey: productQueryKeys.lists.filtered({ locale, limit: itemsPerPage }),
    queryFn: () => getProductsInfinite({ limit: itemsPerPage, locale }),
    initialData,
  })
}

const useProductsInfinite = ({
  locale,
  categoryId,
  itemsPerPage = 12,
}: UseProductsParams & { categoryId?: string }) => {
  return useInfiniteQuery({
    queryKey: productQueryKeys.lists.filtered({
      locale,
      categoryId,
      limit: itemsPerPage,
    }),
    queryFn: ({ pageParam }) =>
      getProductsInfinite({
        cursor: pageParam as string | undefined,
        limit: itemsPerPage,
        categoryId,
        locale,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}

const useProductPrice = (product: ProductWithVariants | null | undefined) => {
  const { currencyOptions } = useExchangeRate()

  return useMemo(() => {
    if (!product) {
      return {
        maxDiscountPercentage: 0,
        minPrice: 0,
        maxPrice: 0,
        displayPrice: '',
        allPriceInfos: [],
      }
    }

    const variants = product.variants || []

    const allPriceInfos =
      variants.length === 0
        ? [getProductPriceInfo(product)]
        : variants.map((v) => getProductPriceInfo(v))

    const maxDiscountPercentage = Math.max(
      ...allPriceInfos.map((i) => i.discountPercentage),
    )
    const minPrice = Math.min(...allPriceInfos.map((i) => i.price))
    const maxPrice = Math.max(...allPriceInfos.map((i) => i.price))

    const displayPrice =
      minPrice === maxPrice
        ? formatCurrency(minPrice, currencyOptions)
        : formatCurrencyRange(minPrice, maxPrice, currencyOptions)

    return {
      maxDiscountPercentage,
      minPrice,
      maxPrice,
      displayPrice,
      allPriceInfos,
    }
  }, [product, currencyOptions])
}

const useSimilarProducts = ({
  locale,
  categoryId,
  excludeProductId,
  limit = PAGINATION.ITEMS_PER_PAGE,
}: UseSimilarProductsParams) => {
  return useQuery({
    queryKey: productQueryKeys.lists.similar(locale, categoryId),
    queryFn: () => getProductsInfinite({ locale, categoryId, limit }),
    enabled: !!categoryId,
    select: (data) => ({
      ...data,
      items: data.items?.filter((item) => item?.id !== excludeProductId) ?? [],
    }),
  })
}

export {
  useProduct,
  useProducts,
  useProductsInfinite,
  useProductPrice,
  useSimilarProducts,
}
