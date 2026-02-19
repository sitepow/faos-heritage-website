interface CommissionTier {
  salesRange: string
  percentage: string
  isHighlight?: boolean
}

interface StepItem {
  number: string
  title: string
  description: string
}

export type { CommissionTier, StepItem }
