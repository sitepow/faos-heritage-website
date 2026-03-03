/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface PostLocaleUIState {
  isOpen: boolean
  selectedId: string | null
  openForm: (id?: string) => void
  closeForm: () => void
}

const usePostLocaleUIStore = create<PostLocaleUIState>((set) => ({
  isOpen: false,
  selectedId: null,

  openForm: (id) =>
    set({
      isOpen: true,
      selectedId: id ?? null,
    }),

  closeForm: () =>
    set({
      isOpen: false,
      selectedId: null,
    }),
}))

export { usePostLocaleUIStore }
