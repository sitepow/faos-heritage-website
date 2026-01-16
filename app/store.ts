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
  exchangeRates: Record<string, number> | null
  hasHydrated: boolean

  setState: (state: Partial<AppStore>) => void
  setExchangeRates: (rates: Record<string, number>) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      country: {
        country: 'US',
        currency: 'USD',
        name: 'United States',
        locale: 'en-US',
      },
      exchangeRates: null,
      hasHydrated: false,

      setState: (state) => set(state),
      setExchangeRates: (rates) => set({ exchangeRates: rates }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        country: state.country,
        exchangeRates: state.exchangeRates,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setState({ hasHydrated: true })
      },
    },
  ),
)
