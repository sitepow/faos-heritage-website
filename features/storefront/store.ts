/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface StorefrontState {
  selectedId: string | null
  isFormOpen: boolean
  isDeleteOpen: boolean
  openForm: (id?: string) => void
  closeForm: () => void
  openDelete: (id: string) => void
  closeDelete: () => void
}

const useStorefrontStore = create<StorefrontState>((set) => ({
  selectedId: null,
  isFormOpen: false,
  isDeleteOpen: false,

  openForm: (id) => set({ selectedId: id ?? null, isFormOpen: true }),
  closeForm: () => set({ selectedId: null, isFormOpen: false }),

  openDelete: (id) => set({ selectedId: id, isDeleteOpen: true }),
  closeDelete: () => set({ selectedId: null, isDeleteOpen: false }),
}))

export { useStorefrontStore }
