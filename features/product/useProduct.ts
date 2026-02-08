import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type {
  UseProductParams,
  UseProductsParams,
  UseProductPriceParams,
  UseSimilarProductsParams,
} from './product.types'

import { getProduct, getProductsInfinite } from './product.action'
import { productQueryKeys } from './product.query-key'
import { useExchangeRate } from '../exchangeRate/useExchangeRate'

import { PAGINATION } from '@/constants'
import { resolveRangeDisplayValue } from '@/utils'
import { formatCurrency, formatCurrencyRange } from '@/utils/number'

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

const useProductPrice = ({
  price,
  priceMin,
  priceMax,
}: UseProductPriceParams) => {
  const { currencyOptions } = useExchangeRate()

  const displayPrice = useMemo(
    () =>
      resolveRangeDisplayValue(
        { min: priceMin, max: priceMax, fallback: price },
        {
          single: (value) => formatCurrency(value, currencyOptions),
          range: (min, max) => formatCurrencyRange(min, max, currencyOptions),
        },
      ),
    [price, priceMin, priceMax, currencyOptions],
  )

  return { displayPrice }
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

export { useProduct, useProducts, useProductPrice, useSimilarProducts }
