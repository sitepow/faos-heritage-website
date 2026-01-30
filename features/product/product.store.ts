/* eslint-disable no-unused-vars */
import { create } from 'zustand'

import type { GetProductResult } from '@/features/product/product.action'

interface ProductUIState {
  selectedProductId: string | null
  isFormOpen: boolean
}

interface ProductDetailStore {
  product?: GetProductResult | null
  setProductDetailState: (state: Partial<ProductDetailStore>) => void
}
interface ProductUIActions {
  openForm: (productId?: string | null) => void
  closeForm: () => void
  selectProduct: (productId: string | null) => void
  reset: () => void
}

type ProductUIStore = ProductUIState & ProductUIActions

const useProductUIStore = create<ProductUIStore>((set) => ({
  selectedProductId: null,
  isFormOpen: false,

  openForm: (productId = null) =>
    set({
      selectedProductId: productId,
      isFormOpen: true,
    }),

  closeForm: () =>
    set({
      isFormOpen: false,
      selectedProductId: null,
    }),

  selectProduct: (productId) => set({ selectedProductId: productId }),

  reset: () =>
    set({
      selectedProductId: null,
      isFormOpen: false,
    }),
}))

const useProductDetailStore = create<ProductDetailStore>()((set) => ({
  product: null,
  setProductDetailState: (state) => set(state),
}))

export { useProductUIStore, useProductDetailStore }
