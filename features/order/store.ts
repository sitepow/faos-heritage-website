/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface OrderStore {
  orderId: string | null
  isOrderOpen: boolean
  isViewOpen: boolean
  isOrderCancelOpen: boolean
  onOpenOrderChange: (open?: boolean) => void
  onOpenViewChange: (open?: boolean) => void
  onOpenOrderCancelChange: (open?: boolean) => void
  setState: (state: Partial<OrderStore>) => void
}

const useOrderStore = create<OrderStore>()((set) => ({
  orderId: null,
  isOrderOpen: false,
  isViewOpen: false,
  isOrderCancelOpen: false,
  onOpenOrderChange: (open) =>
    set((state) => ({
      isOrderOpen: open ?? !state.isOrderOpen,
    })),
  onOpenViewChange: (open) =>
    set((state) => ({
      isViewOpen: open ?? !state.isViewOpen,
    })),
  onOpenOrderCancelChange: (open) =>
    set((state) => ({
      isOrderCancelOpen: open ?? !state.isOrderCancelOpen,
    })),
  setState: (state) => set(state),
}))

export { useOrderStore }
