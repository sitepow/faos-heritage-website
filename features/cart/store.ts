/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface CartStore {
  cartId: string | null
  setState: (state: Partial<CartStore>) => void
}

const useCartStore = create<CartStore>()((set) => ({
  cartId: null,
  setState: (state) => set(state),
}))

export { useCartStore }
