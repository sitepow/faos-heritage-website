/* eslint-disable no-unused-vars */
'use client'

import { create } from 'zustand'

import type { GetAffiliatesResult } from './action'

type AffiliateItem = GetAffiliatesResult[number]

interface AffiliateUIState {
  selectedAffiliate: AffiliateItem | null
  isDetailOpen: boolean
  openDetail: (item: AffiliateItem) => void
  closeDetail: () => void
}

const useAffiliateStore = create<AffiliateUIState>((set) => {
  return {
    selectedAffiliate: null,
    isDetailOpen: false,
    openDetail: (item) => {
      return set({ selectedAffiliate: item, isDetailOpen: true })
    },
    closeDetail: () => {
      return set({ selectedAffiliate: null, isDetailOpen: false })
    },
  }
})

export { useAffiliateStore }
