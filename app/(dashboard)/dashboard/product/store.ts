import { create } from 'zustand'

interface ProductStore {
  productId: string | null
  variantId: string | null
  imageId: string | null

  isProductOpen: boolean
  isImageManagerOpen: boolean
  isVariantManagerOpen: boolean
  isImageOpen: boolean
  isVariantOpen: boolean
  onOpenProductChange: (open?: boolean) => void
  onOpenImageChange: (open?: boolean) => void
  onOpenVariantChange: (open?: boolean) => void
  onOpenVariantManagerChange: (open?: boolean) => void
  onOpenImageManagerChange: (open?: boolean) => void
  setState: (state: Partial<ProductStore>) => void
}

const useProductStore = create<ProductStore>()((set) => ({
  productId: null,
  variantId: null,
  imageId: null,

  isProductOpen: false,
  isImageManagerOpen: false,
  isVariantManagerOpen: false,
  isImageOpen: false,
  isVariantOpen: false,
  onOpenProductChange: (open) =>
    set((state) => ({
      isProductOpen: open ?? !state.isProductOpen,
    })),
  onOpenImageChange: (open) =>
    set((state) => ({
      isImageOpen: open ?? !state.isImageOpen,
    })),
  onOpenVariantChange: (open) =>
    set((state) => ({
      isVariantOpen: open ?? !state.isVariantOpen,
    })),
  onOpenImageManagerChange: (open) =>
    set((state) => ({
      isImageManagerOpen: open ?? !state.isImageManagerOpen,
    })),
  onOpenVariantManagerChange: (open) =>
    set((state) => ({
      isVariantManagerOpen: open ?? !state.isVariantManagerOpen,
    })),
  setState: (state) => set(state),
}))

export { useProductStore }
