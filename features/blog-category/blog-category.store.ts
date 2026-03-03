/* eslint-disable no-unused-vars */
'use client'

import { create } from 'zustand'

interface BlogCategoryUIState {
  selectedCategoryId: string | null
  isFormOpen: boolean
  openForm: (id?: string) => void
  closeForm: () => void
}

const useBlogCategoryUIStore = create<BlogCategoryUIState>((set) => ({
  selectedCategoryId: null,
  isFormOpen: false,
  openForm: (id) => set({ selectedCategoryId: id || null, isFormOpen: true }),
  closeForm: () => set({ selectedCategoryId: null, isFormOpen: false }),
}))

export { useBlogCategoryUIStore }
