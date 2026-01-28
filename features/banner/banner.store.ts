/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface BannerUIState {
  selectedBannerId: string | null

  isFormOpen: boolean
  isManagerOpen: boolean
}

interface BannerUIActions {
  openForm: (bannerId?: string | null) => void
  closeForm: () => void

  openManager: () => void
  closeManager: () => void

  selectBanner: (bannerId: string | null) => void
  reset: () => void
}

type BannerUIStore = BannerUIState & BannerUIActions

const useBannerUIStore = create<BannerUIStore>((set) => ({
  selectedBannerId: null,
  isFormOpen: false,
  isManagerOpen: false,

  openForm: (bannerId = null) =>
    set({
      selectedBannerId: bannerId,
      isFormOpen: true,
    }),

  closeForm: () =>
    set({
      isFormOpen: false,
      selectedBannerId: null,
    }),

  openManager: () =>
    set({
      isManagerOpen: true,
    }),

  closeManager: () =>
    set({
      isManagerOpen: false,
      selectedBannerId: null,
    }),

  selectBanner: (bannerId) =>
    set({
      selectedBannerId: bannerId,
    }),

  reset: () =>
    set({
      selectedBannerId: null,
      isFormOpen: false,
      isManagerOpen: false,
    }),
}))

export { useBannerUIStore }
