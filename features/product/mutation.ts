import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createProduct,
  updateProduct,
  deleteProduct,
  increaseProductView,
} from './action'
import { productQueryKeys } from './query-key'
import { categoryQueryKeys } from '../category/query-key'

const useProductMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.lists.all(),
      })
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
    },
  })

  const update = useMutation({
    mutationFn: updateProduct,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.lists.all(),
      })
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.details.byId(variables.id as string),
      })
    },
  })

  const increaseView = useMutation({
    mutationFn: (id: string) => increaseProductView(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.details.byId(id),
      })
    },
  })

  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
    },
  })

  return {
    create: create.mutateAsync,
    isCreating: create.isPending,
    update: update.mutateAsync,
    isUpdating: update.isPending,
    remove: remove.mutateAsync,
    isDeleting: remove.isPending,
    increaseView: increaseView.mutate,
    isIncreasingView: increaseView.isPending,
  }
}

export { useProductMutation }
