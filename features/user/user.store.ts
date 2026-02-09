/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface UserStore {
  userId: string | null
  isUserOpen: boolean
  onOpenUserChange: (open?: boolean) => void
  setState: (state: Partial<UserStore>) => void
}

export const useAuthStore = create<UserStore>()((set) => ({
  userId: null,
  isUserOpen: false,
  onOpenUserChange: (open) =>
    set((state) => ({
      isUserOpen: open ?? !state.isUserOpen,
    })),
  setState: (state) => set(state),
}))
