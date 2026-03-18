interface AffiliateFilter {
  startDate?: string | Date
  endDate?: string | Date
}

interface GetAffiliateOrdersOptions extends AffiliateFilter {
  page?: number
  limit?: number
}

export type { AffiliateFilter, GetAffiliateOrdersOptions }
