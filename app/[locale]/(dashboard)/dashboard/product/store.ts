/* eslint-disable no-unused-vars */

import { create } from 'zustand'

interface ProductStore {
  productLocalizationId: string | null
  productId: string | null
  variantId: string | null
  imageId: string | null
  categoryId: string | null
  shippingCountryId: string | null
  isImageManagerOpen: boolean
  isVariantManagerOpen: boolean
  isCategoryManagerOpen: boolean
  isShippingCountryManagerOpen: boolean
  isProductOpen: boolean
  isImageOpen: boolean
  isVariantOpen: boolean
  isCategoryOpen: boolean
  isShippingCountryOpen: boolean
  isProductLocalizationOpen: boolean
  isProductLocalizationManagerOpen: boolean
  isProductVariantLocalizationOpen: boolean
  onOpenProductLocalizationChange: (open?: boolean) => void
  onOpenProductLocalizationManagerChange: (open?: boolean) => void
  isCategoryLocalizationOpen: boolean
  onOpenCategoryLocalizationChange: (open?: boolean) => void
  onOpenProductVariantLocalizationChange: (open?: boolean) => void
  onOpenVariantManagerChange: (open?: boolean) => void
  onOpenImageManagerChange: (open?: boolean) => void
  onOpenCategoryManagerChange: (open?: boolean) => void
  onOpenShippingCountryManagerChange: (open?: boolean) => void
  onOpenCategoryChange: (open?: boolean) => void
  onOpenVariantChange: (open?: boolean) => void
  onOpenImageChange: (open?: boolean) => void
  onOpenProductChange: (open?: boolean) => void
  onOpenShippingCountryChange: (open?: boolean) => void
  setState: (state: Partial<ProductStore>) => void
}

export const useProductStore = create<ProductStore>()((set) => ({
  productLocalizationId: null,
  productId: null,
  variantId: null,
  imageId: null,
  categoryId: null,
  shippingCountryId: null,
  isProductOpen: false,
  isImageOpen: false,
  isVariantOpen: false,
  isCategoryOpen: false,
  isShippingCountryOpen: false,
  isImageManagerOpen: false,
  isVariantManagerOpen: false,
  isCategoryManagerOpen: false,
  isShippingCountryManagerOpen: false,
  isProductLocalizationOpen: false,
  isProductLocalizationManagerOpen: false,
  onOpenProductLocalizationManagerChange: (open) =>
    set((state) => ({
      isProductLocalizationManagerOpen:
        open ?? !state.isProductLocalizationManagerOpen,
    })),
  onOpenProductLocalizationChange: (open) =>
    set((state) => ({
      isProductLocalizationOpen: open ?? !state.isProductLocalizationOpen,
    })),
  isCategoryLocalizationOpen: false,
  onOpenCategoryLocalizationChange: (open) =>
    set((state) => ({
      isCategoryLocalizationOpen: open ?? !state.isCategoryLocalizationOpen,
    })),
  isProductVariantLocalizationOpen: false,
  onOpenProductVariantLocalizationChange: (open) =>
    set((state) => ({
      isProductVariantLocalizationOpen:
        open ?? !state.isProductVariantLocalizationOpen,
    })),
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
  onOpenShippingCountryManagerChange: (open) =>
    set((state) => ({
      isShippingCountryManagerOpen: open ?? !state.isShippingCountryManagerOpen,
    })),
  onOpenShippingCountryChange: (open) =>
    set((state) => ({
      isShippingCountryOpen: open ?? !state.isShippingCountryOpen,
    })),
  setState: (state) => set(state),
}))
