import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import { createProduct, updateProduct, deleteProduct } from './product.action'
import { productQueryKeys } from './product.query-key'
import { categoryQueryKeys } from '../category/category.query-key'

const useProductMutation = () => {
  const t = useTranslations('message')
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.lists.all(),
        })
        queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
        toast.success(t('create_success'))
      }
    },
  })

  const update = useMutation({
    mutationFn: updateProduct,
    onSuccess: (res, variables) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.lists.all(),
        })
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.details.byId(variables.id as string),
        })
        toast.success(t('update_success'))
      }
    },
  })

  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
        queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
        toast.success(t('delete_success'))
      }
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
