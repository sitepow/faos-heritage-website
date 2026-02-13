import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteAddress } from './address.action'
import { addressQueryKeys } from './address.query-key'

const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.all })
    },
  })

  return mutation
}

export { useDeleteAddress }
