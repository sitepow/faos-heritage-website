/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface ProductLocaleUIState {
  selectedLocalizationId: string | null
  isFormOpen: boolean
  isManagerOpen: boolean
  isCategoryLocalizationOpen: boolean
  isVariantLocalizationOpen: boolean
}

interface ProductLocaleUIActions {
  openForm: (id?: string | null) => void
  closeForm: () => void

  openManager: () => void
  closeManager: () => void

  openCategoryLocalization: () => void
  closeCategoryLocalization: () => void

  openVariantLocalization: () => void
  closeVariantLocalization: () => void

  reset: () => void
}

type ProductLocaleUIStore = ProductLocaleUIState & ProductLocaleUIActions

const useProductLocaleUIStore = create<ProductLocaleUIStore>((set) => ({
  selectedLocalizationId: null,
  isFormOpen: false,
  isManagerOpen: false,
  isCategoryLocalizationOpen: false,
  isVariantLocalizationOpen: false,

  openForm: (id = null) =>
    set({
      selectedLocalizationId: id,
      isFormOpen: true,
    }),

  closeForm: () =>
    set({
      isFormOpen: false,
      selectedLocalizationId: null,
    }),

  openManager: () => set({ isManagerOpen: true }),
  closeManager: () =>
    set({
      isManagerOpen: false,
      selectedLocalizationId: null,
    }),

  openCategoryLocalization: () => set({ isCategoryLocalizationOpen: true }),
  closeCategoryLocalization: () => set({ isCategoryLocalizationOpen: false }),

  openVariantLocalization: () => set({ isVariantLocalizationOpen: true }),
  closeVariantLocalization: () => set({ isVariantLocalizationOpen: false }),

  reset: () =>
    set({
      selectedLocalizationId: null,
      isFormOpen: false,
      isManagerOpen: false,
      isCategoryLocalizationOpen: false,
      isVariantLocalizationOpen: false,
    }),
}))

export { useProductLocaleUIStore }
