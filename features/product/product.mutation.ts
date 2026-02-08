import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createProduct, updateProduct, deleteProduct } from './product.action'
import { productQueryKeys } from './product.query-key'
import { categoryQueryKeys } from '../category/category.query-key'

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
  }
}

export { useProductMutation }
