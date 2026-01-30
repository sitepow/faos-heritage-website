import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'

import type { GetProductsResult } from '@/app/[locale]/(main)/products/action'

import { productQueryKeys } from './product.query-key'
import { createCart } from '../cart/cart.action'
import { cartQueryKeys } from '../cart/cart.query-key'
import { useExchangeRate } from '../exchangeRate/useExchangeRate'
import { favoriteQueryKeys } from '../favorite/favorite.query-key'

import { useProductDetailStore } from '@/app/[locale]/(main)/products/[slug]/store'
import { getProducts } from '@/app/[locale]/(main)/products/action'
import { useAppStore } from '@/app/store'
import { PAGINATION } from '@/constants/app'
import { createFavorite } from '@/features/favorite/favorite.action'
import { ERROR_CODES } from '@/lib/errors'
import { resolveRangeDisplayValue } from '@/utils/app'
import { formatCurrency, formatCurrencyRange } from '@/utils/number'

interface UseProductsParams {
  locale: string
  itemsPerPage: number
  initialData?: GetProductsResult
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

const useProducts = ({
  locale,
  itemsPerPage,
  initialData,
}: UseProductsParams) => {
  return useQuery({
    queryKey: productQueryKeys.list.homepage(locale, itemsPerPage),
    queryFn: () => getProducts({ limit: itemsPerPage, locale }),
    initialData,
  })
}

const useProductPrice = ({
  price,
  priceMin,
  priceMax,
}: UseProductPriceParams) => {
  const { appLocale } = useAppStore()

  const { data: exchangeRates } = useExchangeRate()

  const currencyOptions = useMemo(
    () => ({
      currency: appLocale?.currency,
      locale: appLocale?.locale,
      rates: exchangeRates,
    }),
    [appLocale?.currency, appLocale?.locale, exchangeRates],
  )

  const displayPrice = useMemo(
    () =>
      resolveRangeDisplayValue(
        {
          min: priceMin,
          max: priceMax,
          fallback: price,
        },
        {
          single: (value) => formatCurrency(value, currencyOptions),
          range: (min, max) => formatCurrencyRange(min, max, currencyOptions),
        },
      ),
    [price, priceMin, priceMax, currencyOptions],
  )

  return {
    displayPrice,
  }
}

const useSimilarProducts = ({
  locale,
  categoryId,
  excludeProductId,
  limit = PAGINATION.ITEMS_PER_PAGE,
}: UseSimilarProductsParams) => {
  return useQuery<GetProductsResult>({
    queryKey: productQueryKeys.list.similar(locale, categoryId),
    queryFn: () => getProducts({ locale, categoryId, limit }),
    enabled: !!categoryId,
    select: (data) => ({
      ...data,
      items: data.items?.filter((item) => item.id !== excludeProductId) ?? [],
    }),
  })
}

const useProductPurchase = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { product } = useProductDetailStore()
  const queryClient = useQueryClient()

  const defaultVariantId =
    product?.cart?.[0]?.variantId ?? product?.variants?.[0]?.id ?? null
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariantId,
  )
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = useMemo(
    () => product?.variants?.find((v) => v.id === selectedVariantId),
    [product?.variants, selectedVariantId],
  )

  const price = selectedVariant?.price ?? product?.price ?? 0
  const stock = selectedVariant?.stockQuantity ?? product?.stockQuantity ?? 0
  const isOutOfStock = stock <= 0
  const hasVariants = Boolean(product?.variants?.length)
  const hasFavorite = Boolean(product?.wishlist?.length)

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !product) {
        throw new Error(ERROR_CODES.FIELD_REQUIRED)
      }

      return createCart({
        userId,
        productId: product.id,
        variantId: selectedVariantId,
        quantity,
      })
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.root }),
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.detail.byId(product!.id),
        }),
      ])
    },
  })

  const addToFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !product) {
        throw new Error(ERROR_CODES.UNAUTHORIZED)
      }

      return createFavorite(userId, product.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.detail.all })
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail.byId(product!.id),
      })
    },
  })

  return {
    product,
    state: {
      selectedVariantId,
      quantity,
      price,
      stock,
      hasVariants,
      hasFavorite,
      isOutOfStock,
      selectedVariant,
    },
    actions: {
      selectVariant: setSelectedVariantId,
      changeQuantity: setQuantity,
      addToCart: addToCartMutation.mutate,
      addToFavorite: addToFavoriteMutation.mutate,
    },
    loading: {
      isAddingToCart: addToCartMutation.isPending,
      isAddingToFavorite: addToFavoriteMutation.isPending,
    },
  }
}

export { useProducts, useProductPrice, useSimilarProducts, useProductPurchase }
