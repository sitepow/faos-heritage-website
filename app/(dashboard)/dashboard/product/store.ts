/* eslint-disable no-unused-vars */

import { create } from 'zustand'

interface ProductStore {
  productId: string | null
  variantId: string | null
  imageId: string | null
  categoryId: string | null
  isProductOpen: boolean
  isImageManagerOpen: boolean
  isVariantManagerOpen: boolean
  isCategoryManagerOpen: boolean
  isImageOpen: boolean
  isVariantOpen: boolean
  isCategoryOpen: boolean
  onOpenProductChange: (open?: boolean) => void
  onOpenImageChange: (open?: boolean) => void
  onOpenVariantChange: (open?: boolean) => void
  onOpenCategoryChange: (open?: boolean) => void
  onOpenVariantManagerChange: (open?: boolean) => void
  onOpenImageManagerChange: (open?: boolean) => void
  onOpenCategoryManagerChange: (open?: boolean) => void
  setState: (state: Partial<ProductStore>) => void
}

export const useProductStore = create<ProductStore>()((set) => ({
  productId: null,
  variantId: null,
  imageId: null,
  categoryId: null,
  isProductOpen: false,
  isImageManagerOpen: false,
  isVariantManagerOpen: false,
  isCategoryManagerOpen: false,
  isImageOpen: false,
  isVariantOpen: false,
  isCategoryOpen: false,
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
  onOpenCategoryChange: (open) =>
    set((state) => ({
      isCategoryOpen: open ?? !state.isCategoryOpen,
    })),
  onOpenImageManagerChange: (open) =>
    set((state) => ({
      isImageManagerOpen: open ?? !state.isImageManagerOpen,
    })),
  onOpenVariantManagerChange: (open) =>
    set((state) => ({
      isVariantManagerOpen: open ?? !state.isVariantManagerOpen,
    })),
  onOpenCategoryManagerChange: (open) =>
    set((state) => ({
      isCategoryManagerOpen: open ?? !state.isCategoryManagerOpen,
    })),
  setState: (state) => set(state),
}))
