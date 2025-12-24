/* eslint-disable no-unused-vars */

import { create } from 'zustand'

interface AddressStore {
  addressId: string | null
  isAddressOpen: boolean
  onOpenAddressChange: (open?: boolean) => void
  setState: (state: Partial<AddressStore>) => void
}

export const useAddressStore = create<AddressStore>()((set) => ({
  addressId: null,
  isAddressOpen: false,
  onOpenAddressChange: (open) =>
    set((state) => ({
      isAddressOpen: open ?? !state.isAddressOpen,
    })),
  setState: (state) => set(state),
}))
