/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface ProductImageUIState {
  selectedImageId: string | null
  isFormOpen: boolean
  isManagerOpen: boolean
}

interface ProductImageUIActions {
  openForm: (imageId?: string | null) => void
  closeForm: () => void

  openManager: () => void
  closeManager: () => void

  selectImage: (imageId: string | null) => void
  reset: () => void
}

type ProductImageUIStore = ProductImageUIState & ProductImageUIActions

const useProductImageUIStore = create<ProductImageUIStore>((set) => ({
  selectedImageId: null,
  isFormOpen: false,
  isManagerOpen: false,

  openForm: (imageId = null) =>
    set({
      selectedImageId: imageId,
      isFormOpen: true,
    }),

  closeForm: () =>
    set({
      isFormOpen: false,
      selectedImageId: null,
    }),

  openManager: () => set({ isManagerOpen: true }),
  closeManager: () =>
    set({
      isManagerOpen: false,
      selectedImageId: null,
    }),

  selectImage: (imageId) => set({ selectedImageId: imageId }),

  reset: () =>
    set({
      selectedImageId: null,
      isFormOpen: false,
      isManagerOpen: false,
    }),
}))

export { useProductImageUIStore }
