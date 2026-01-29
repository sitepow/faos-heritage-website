/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface ProductVariantUIState {
  selectedVariantId: string | null
  isFormOpen: boolean
  isManagerOpen: boolean
}

interface ProductVariantUIActions {
  openForm: (variantId?: string | null) => void
  closeForm: () => void

  openManager: () => void
  closeManager: () => void

  selectVariant: (variantId: string | null) => void
  reset: () => void
}

type ProductVariantUIStore = ProductVariantUIState & ProductVariantUIActions

const useProductVariantUIStore = create<ProductVariantUIStore>((set) => ({
  selectedVariantId: null,
  isFormOpen: false,
  isManagerOpen: false,

  openForm: (variantId = null) =>
    set({
      selectedVariantId: variantId,
      isFormOpen: true,
    }),

  closeForm: () =>
    set({
      isFormOpen: false,
      selectedVariantId: null,
    }),

  openManager: () => set({ isManagerOpen: true }),
  closeManager: () =>
    set({
      isManagerOpen: false,
      selectedVariantId: null,
    }),

  selectVariant: (variantId) => set({ selectedVariantId: variantId }),

  reset: () =>
    set({
      selectedVariantId: null,
      isFormOpen: false,
      isManagerOpen: false,
    }),
}))

export { useProductVariantUIStore }
