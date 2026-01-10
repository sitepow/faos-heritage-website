/* eslint-disable no-unused-vars */
import { create } from 'zustand'

import type { GetProductResult } from '@/app/[locale]/(dashboard)/dashboard/product/action/product'

interface ProductDetailStore {
  product?: GetProductResult | null
  setProductDetailState: (state: Partial<ProductDetailStore>) => void
}

export const useProductDetailStore = create<ProductDetailStore>()((set) => ({
  product: null,
  setProductDetailState: (state) => set(state),
}))
