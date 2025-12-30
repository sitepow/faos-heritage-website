/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SelectedCountry {
  country: string
  currency: string
  locale: string
  name: string
}

interface AppStore {
  country: SelectedCountry | null
  hasHydrated: boolean
  setState: (state: Partial<AppStore>) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      country: null,
      hasHydrated: false,
      setState: (state) => set(state),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        country: state.country,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setState({ hasHydrated: true })
      },
    },
  ),
)
