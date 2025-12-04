import { create } from 'zustand'
import type { GetCartsResult } from './actions/cart'

interface CartStore {
  cartId: string | null
  carts: GetCartsResult

  isDeleteOpen: boolean
  onOpenDeleteChange: (open?: boolean) => void

  setState: (state: Partial<CartStore>) => void
}

const useCartStore = create<CartStore>()((set) => ({
  cartId: '',
  carts: [],

  isDeleteOpen: false,

  onOpenDeleteChange: (open) =>
    set((state) => ({
      isDeleteOpen: open ?? !state.isDeleteOpen,
    })),

  setState: (state) => set(state),
}))

export { useCartStore }
