/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_LOCALE } from '@/constants/app'

interface AppLocale {
  country: string
  currency: string
  locale: string
  name: string
}

interface AppState {
  appLocale: AppLocale
  hasHydrated: boolean
}

interface AppActions {
  setAppLocale: (locale: AppLocale) => void
}

const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      appLocale: DEFAULT_LOCALE,
      hasHydrated: false,

      setAppLocale: (appLocale) => set({ appLocale }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        appLocale: state.appLocale,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hasHydrated: true })
      },
    },
  ),
)

export { useAppStore }
export type { AppLocale }
