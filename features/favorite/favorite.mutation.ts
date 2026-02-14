import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createFavorite, deleteFavorite } from './favorite.action'
import { favoriteQueryKeys } from './favorite.query-key'
import { productQueryKeys } from '../product/product.query-key'

import { useAuth } from '@/hooks/useAuth'

const useFavoriteMutation = () => {
  const queryClient = useQueryClient()
  const { userId } = useAuth()

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.all })
    queryClient.invalidateQueries({ queryKey: ['carts', userId] })
  }

  const add = useMutation({
    mutationFn: (productId: string) => createFavorite(productId),
    onSuccess: (res, productId) => {
      if (res) {
        invalidateAll()
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.details.byId(productId),
        })
      }
    },
  })

  const remove = useMutation({
    mutationFn: (productId: string) => deleteFavorite({ productId }),
    onSuccess: (res) => {
      if (res) {
        invalidateAll()
      }
    },
  })

  return {
    addToFav: add.mutateAsync,
    isAdding: add.isPending,
    removeFromFav: remove.mutateAsync,
    isRemoving: remove.isPending,
  }
}

export { useFavoriteMutation }
