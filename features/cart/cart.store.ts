/* eslint-disable no-unused-vars */
import { create } from 'zustand'

import type { GetCartsResult } from './cart.action'

interface CartStore {
  cartId: string | null
  carts: GetCartsResult
  isDeleteOpen: boolean
  onOpenDeleteChange: (open?: boolean) => void
  setState: (state: Partial<CartStore>) => void
}

export const useCartStore = create<CartStore>()((set) => ({
  cartId: '',
  carts: [],
  isDeleteOpen: false,
  onOpenDeleteChange: (open) =>
    set((state) => ({
      isDeleteOpen: open ?? !state.isDeleteOpen,
    })),
  setState: (state) => set(state),
}))
