import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import { createFavorite } from './favorite.action'
import { favoriteQueryKeys } from './favorite.query-key'
import { productQueryKeys } from '../product/product.query-key'

const useFavoriteMutation = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('messages')

  const add = useMutation({
    mutationFn: (productId: string) => createFavorite(productId),
    onSuccess: (res, productId) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.all })

        queryClient.invalidateQueries({
          queryKey: productQueryKeys.details.byId(productId),
        })
        toast.success(t('messages.create_success'))
      }
    },
  })

  return {
    addToFav: add.mutateAsync,
    isAdding: add.isPending,
  }
}

export { useFavoriteMutation }
