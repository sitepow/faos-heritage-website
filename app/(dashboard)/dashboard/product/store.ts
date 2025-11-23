import { create } from 'zustand'

interface ProductStore {
  productId: string | null
  setProductState: (state: Partial<ProductStore>) => void
}

const useProductStore = create<ProductStore>()((set) => ({
  productId: null,
  setProductState: (state) => set(state),
}))

export { useProductStore }
