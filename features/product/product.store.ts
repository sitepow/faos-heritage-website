/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { GetProductResult } from './product.types'

interface ProductUIState {
  selectedProductId: string | null
  isFormOpen: boolean
}

interface ProductUIActions {
  openForm: (productId?: string | null) => void
  closeForm: () => void
  selectProduct: (productId: string | null) => void
  reset: () => void
}

interface ProductDetailState {
  product: GetProductResult | null
}

interface ProductDetailActions {
  setProduct: (product: GetProductResult | null) => void
  updateProductFields: (fields: Partial<NonNullable<GetProductResult>>) => void
  reset: () => void
}

type ProductUIStore = ProductUIState & ProductUIActions
type ProductDetailStore = ProductDetailState & ProductDetailActions

const useProductUIStore = create<ProductUIStore>()(
  immer((set) => ({
    selectedProductId: null,
    isFormOpen: false,

    openForm: (productId = null) =>
      set((state) => {
        state.selectedProductId = productId
        state.isFormOpen = true
      }),

    closeForm: () =>
      set((state) => {
        state.isFormOpen = false
        state.selectedProductId = null
      }),

    selectProduct: (productId) =>
      set((state) => {
        state.selectedProductId = productId
      }),

    reset: () =>
      set((state) => {
        state.selectedProductId = null
        state.isFormOpen = false
      }),
  })),
)

const useProductDetailStore = create<ProductDetailStore>()(
  immer((set) => ({
    product: null,

    setProduct: (product) =>
      set((state) => {
        state.product = product
      }),

    updateProductFields: (fields) =>
      set((state) => {
        if (state.product) {
          state.product = { ...state.product, ...fields }
        }
      }),

    reset: () =>
      set((state) => {
        state.product = null
      }),
  })),
)

export { useProductUIStore, useProductDetailStore }
