import { create } from 'zustand'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'

interface ProductStore {
  product: GetProductResult | null
  setProduct: (product: GetProductResult) => void
}

const useProductStore = create<ProductStore>()((set) => ({
  product: null,
  setProduct: (product) => set({ product }),
}))

export { useProductStore }
