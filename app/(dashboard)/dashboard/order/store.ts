import { create } from 'zustand'

interface OrderStore {
  orderId: string | null
  isOrderOpen: boolean
  onOpenOrderChange: (open?: boolean) => void
  setState: (state: Partial<OrderStore>) => void
}

const useOrderStore = create<OrderStore>()((set) => ({
  orderId: null,
  isOrderOpen: false,
  onOpenOrderChange: (open) =>
    set((state) => ({
      isOrderOpen: open ?? !state.isOrderOpen,
    })),
  setState: (state) => set(state),
}))

export { useOrderStore }
