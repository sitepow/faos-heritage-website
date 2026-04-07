type FaqListFilters = {
  limit?: number
  locale?: string
}

const faqQueryKeys = {
  all: ['faqs'] as const,
  lists: {
    all: () => [...faqQueryKeys.all, 'list'],
    filtered: (filters: FaqListFilters) => [
      ...faqQueryKeys.lists.all(),
      filters,
    ],
  },
  details: {
    all: () => [...faqQueryKeys.all, 'detail'],
    byId: (id: string, locale?: string) => [
      ...faqQueryKeys.details.all(),
      'id',
      id,
      { locale },
    ],
    bySlug: (slug: string, locale?: string) => [
      ...faqQueryKeys.details.all(),
      'slug',
      slug,
      { locale },
    ],
  },
}

export { faqQueryKeys }
export type { FaqListFilters }
