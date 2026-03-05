import { PayoutStatus } from '@prisma/client'

interface CommissionSummary {
  status: PayoutStatus
  _sum: {
    commissionAmount: number | null
  }
}

interface CommissionItem {
  status: PayoutStatus
  commissionAmount: number
}

type CommissionData = CommissionSummary | CommissionItem

const calculateCommissionByStatus = (
  items: CommissionData[] | undefined,
  status: PayoutStatus,
) => {
  if (!items) {
    return 0
  }

  return items
    .filter((item) => {
      return item.status === status
    })
    .reduce((sum, item) => {
      let amount = 0

      if ('_sum' in item) {
        amount = item._sum.commissionAmount ?? 0
      } else {
        amount = item.commissionAmount ?? 0
      }

      return sum + Number(amount)
    }, 0)
}

const getWithdrawableAmount = (items: CommissionData[] | undefined) => {
  return calculateCommissionByStatus(items, PayoutStatus.COMPLETED)
}

export { calculateCommissionByStatus, getWithdrawableAmount }
export type { CommissionData, CommissionSummary, CommissionItem }
