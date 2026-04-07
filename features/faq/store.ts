/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface FaqUIState {
  selectedId: string | null
  isFormOpen: boolean
}

interface FaqUIActions {
  openForm: (id?: string | null) => void
  closeForm: () => void
}

const useFaqUIStore = create<FaqUIState & FaqUIActions>()(
  immer((set) => ({
    selectedId: null,
    isFormOpen: false,
    openForm: (id = null) =>
      set((state) => {
        state.selectedId = id
        state.isFormOpen = true
      }),
    closeForm: () =>
      set((state) => {
        state.isFormOpen = false
        state.selectedId = null
      }),
  })),
)

export { useFaqUIStore }
