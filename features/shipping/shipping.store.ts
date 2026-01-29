/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface ShippingCountryUIState {
  selectedCountryId: string | null
  isFormOpen: boolean
  isManagerOpen: boolean
}

interface ShippingCountryUIActions {
  openForm: (countryId?: string | null) => void
  closeForm: () => void

  openManager: () => void
  closeManager: () => void

  selectCountry: (countryId: string | null) => void
  reset: () => void
}

type ShippingCountryUIStore = ShippingCountryUIState & ShippingCountryUIActions

const useShippingUIStore = create<ShippingCountryUIStore>((set) => ({
  selectedCountryId: null,
  isFormOpen: false,
  isManagerOpen: false,

  openForm: (countryId = null) =>
    set({
      selectedCountryId: countryId,
      isFormOpen: true,
    }),

  closeForm: () =>
    set({
      isFormOpen: false,
      selectedCountryId: null,
    }),

  openManager: () => set({ isManagerOpen: true }),
  closeManager: () =>
    set({
      isManagerOpen: false,
      selectedCountryId: null,
    }),

  selectCountry: (countryId) => set({ selectedCountryId: countryId }),

  reset: () =>
    set({
      selectedCountryId: null,
      isFormOpen: false,
      isManagerOpen: false,
    }),
}))

export { useShippingUIStore }
