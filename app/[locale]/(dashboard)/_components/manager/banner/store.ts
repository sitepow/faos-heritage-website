/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface ImageBannerStore {
  imageBannerId: string | null
  isImageBannerOpen: boolean
  isImageBannerManagerOpen: boolean
  onOpenImageBannertChange: (open?: boolean) => void
  onOpenImageBannertManagerChange: (open?: boolean) => void
  setState: (state: Partial<ImageBannerStore>) => void
}

export const useImageBannerStore = create<ImageBannerStore>()((set) => ({
  imageBannerId: null,
  isImageBannerOpen: false,
  isImageBannerManagerOpen: false,
  onOpenImageBannertChange: (open) =>
    set((state) => ({
      isImageBannerOpen: open ?? !state.isImageBannerOpen,
    })),
  onOpenImageBannertManagerChange: (open) =>
    set((state) => ({
      isImageBannerManagerOpen: open ?? !state.isImageBannerManagerOpen,
    })),
  setState: (state) => set(state),
}))
