/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface PackageState {
  selectedPackage: string | null
  selectPackage: (title: string) => void
  resetPackage: () => void
}

export const usePackageStore = create<PackageState>((set) => ({
  selectedPackage: null,
  selectPackage: (title) => set({ selectedPackage: title }),
  resetPackage: () => set({ selectedPackage: null }),
}))
