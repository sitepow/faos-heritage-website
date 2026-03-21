'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveStorefrontInventory, transferStorefrontStock } from './action'
import { storefrontInventoryKeys } from './query-key'
import { type StorefrontInventoryInput } from './schema'

import { productQueryKeys } from '@/features/product/query-key'

const useStorefrontInventoryMutation = () => {
  const queryClient = useQueryClient()

  const transfer = useMutation({
    mutationFn: async (
      input: StorefrontInventoryInput & { mode?: 'stock' | 'price' },
    ) => {
      const { mode, ...rest } = input

      if (mode === 'price') {
        return await saveStorefrontInventory({
          storefrontId: rest.storefrontId,
          productId: rest.productId,
          variantId: rest.variantId,
          retailPrice: rest.retailPrice,
          netPrice: rest.netPrice,
        } as StorefrontInventoryInput)
      }

      return await transferStorefrontStock({
        storefrontId: rest.storefrontId,
        productId: rest.productId,
        variantId: rest.variantId,
        stockQuantity: rest.stockQuantity,
        direction: rest.direction,
        retailPrice: rest.retailPrice,
        netPrice: rest.netPrice,
      } as StorefrontInventoryInput)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: storefrontInventoryKeys.all,
      })

      return queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
  })

  return {
    transferStock: transfer.mutateAsync,
    isPending: transfer.isPending,
  }
}

export { useStorefrontInventoryMutation }
