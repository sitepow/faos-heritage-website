/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface PostUIState {
  selectedPostId: string | null
  isFormOpen: boolean
}

interface PostUIActions {
  openForm: (postId?: string | null) => void
  closeForm: () => void
  reset: () => void
}

const usePostUIStore = create<PostUIState & PostUIActions>()(
  immer((set) => ({
    selectedPostId: null,
    isFormOpen: false,

    openForm: (postId = null) =>
      set((state) => {
        state.selectedPostId = postId
        state.isFormOpen = true
      }),

    closeForm: () =>
      set((state) => {
        state.isFormOpen = false
        state.selectedPostId = null
      }),

    reset: () =>
      set((state) => {
        state.selectedPostId = null
        state.isFormOpen = false
      }),
  })),
)

export { usePostUIStore }
