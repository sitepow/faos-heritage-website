type BannerListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const bannerQueryKeys = {
  root: ['banners'] as const,

  list: {
    all: [...['banners'], 'list'] as const,

    byFilter: (filters: BannerListFilters = {}) =>
      [...bannerQueryKeys.list.all, filters] as const,

    homepage: (locale?: string) =>
      [...bannerQueryKeys.list.all, 'homepage', locale] as const,
  },

  detail: {
    all: [...['banners'], 'detail'] as const,

    byId: (id: string) => [...bannerQueryKeys.detail.all, id] as const,
  },
}

export { bannerQueryKeys }
