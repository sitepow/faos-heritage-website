/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface TagUIState {
  selectedTagId: string | null
  isFormOpen: boolean
}

interface TagUIActions {
  openForm: (tagId?: string | null) => void
  closeForm: () => void
}

const useTagUIStore = create<TagUIState & TagUIActions>((set) => ({
  selectedTagId: null,
  isFormOpen: false,
  openForm: (tagId = null) => set({ selectedTagId: tagId, isFormOpen: true }),
  closeForm: () => set({ isFormOpen: false, selectedTagId: null }),
}))

export { useTagUIStore }
