'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveStorefrontInventory, transferStorefrontStock } from './action'
import { storefrontInventoryKeys } from './query-key'

import { productQueryKeys } from '@/features/product/query-key'

const useStorefrontInventoryMutation = () => {
  const queryClient = useQueryClient()

  // Mutation สำหรับบันทึกหรืออัปเดตข้อมูลทั่วไป
  const save = useMutation({
    mutationFn: saveStorefrontInventory,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: storefrontInventoryKeys.all,
      })
    },
  })

  // Mutation สำหรับการโอนสต็อก (Transfer IN/OUT)
  const transfer = useMutation({
    mutationFn: transferStorefrontStock,
    onSuccess: () => {
      // Invalidate ข้อมูลสต็อกหน้าร้าน
      queryClient.invalidateQueries({
        queryKey: storefrontInventoryKeys.all,
      })
      // Invalidate ข้อมูลสินค้าคลังหลักด้วย เพราะสต็อกมีการตัด/เพิ่ม
      return queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
  })

  return {
    saveInventory: save.mutateAsync,
    transferStock: transfer.mutateAsync,
    isPending: save.isPending || transfer.isPending,
  }
}

export { useStorefrontInventoryMutation }
