/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface CategoryUIState {
  selectedCategoryId: string | null
  isFormOpen: boolean
  isManagerOpen: boolean
}

interface CategoryUIActions {
  openForm: (categoryId?: string | null) => void
  closeForm: () => void

  openManager: () => void
  closeManager: () => void

  selectCategory: (categoryId: string | null) => void
  reset: () => void
}

type CategoryUIStore = CategoryUIState & CategoryUIActions

const useCategoryUIStore = create<CategoryUIStore>((set) => ({
  selectedCategoryId: null,
  isFormOpen: false,
  isManagerOpen: false,

  openForm: (categoryId = null) =>
    set({
      selectedCategoryId: categoryId,
      isFormOpen: true,
    }),

  closeForm: () =>
    set({
      isFormOpen: false,
      selectedCategoryId: null,
    }),

  openManager: () => set({ isManagerOpen: true }),
  closeManager: () =>
    set({
      isManagerOpen: false,
      selectedCategoryId: null,
    }),

  selectCategory: (categoryId) => set({ selectedCategoryId: categoryId }),

  reset: () =>
    set({
      selectedCategoryId: null,
      isFormOpen: false,
      isManagerOpen: false,
    }),
}))

export { useCategoryUIStore }
