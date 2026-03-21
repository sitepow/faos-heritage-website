/* eslint-disable no-unused-vars */
import { create } from 'zustand'

import type { StorefrontInventoryInput } from './schema'

interface StorefrontInventoryStore {
  isOpen: boolean
  isEditing: boolean
  data: (StorefrontInventoryInput & { mode?: 'stock' | 'price' }) | null

  onOpen: (
    data?: StorefrontInventoryInput & { mode?: 'stock' | 'price' },
  ) => void
  onClose: () => void
}

const useStorefrontInventoryStore = create<StorefrontInventoryStore>((set) => {
  return {
    isOpen: false,
    isEditing: false,
    data: null,

    onOpen: (data) => {
      return set({
        isOpen: true,
        isEditing: !!data,
        data: data || null,
      })
    },

    onClose: () => {
      return set({
        isOpen: false,
        isEditing: false,
        data: null,
      })
    },
  }
})

export { useStorefrontInventoryStore }
