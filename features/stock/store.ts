/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface StockState {
  selectedProductId: string | null
  selectedVariantId: string | null
  isAdjustmentOpen: boolean
  openAdjustment: (productId: string, variantId?: string | null) => void
  closeAdjustment: () => void
}

const useStockStore = create<StockState>((set) => ({
  selectedProductId: null,
  selectedVariantId: null,
  isAdjustmentOpen: false,

  openAdjustment: (productId, variantId) =>
    set({
      selectedProductId: productId,
      selectedVariantId: variantId ?? null,
      isAdjustmentOpen: true,
    }),
  closeAdjustment: () =>
    set({
      selectedProductId: null,
      selectedVariantId: null,
      isAdjustmentOpen: false,
    }),
}))

export { useStockStore }
