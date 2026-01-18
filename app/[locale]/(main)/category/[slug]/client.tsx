'use client'

import {
  Spinner,
  Skeleton,
  Breadcrumbs,
  BreadcrumbItem,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Divider,
} from '@heroui/react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ArrowUpDownIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import type { GetProductsResult } from '../../products/action'

import { ProductSection } from '../../product/[slug]/_components/section'
import { getProducts } from '../../products/action'

import { getCategory } from '@/app/[locale]/(dashboard)/dashboard/product/action/category'
import { PageNotFound } from '@/components/page-not-found'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { SORT_ITEMS } from '@/utils/constants/product'

interface CategoryClientProps {
  initialProducts: GetProductsResult
  categoryId: string
  itemPerPage: number
}

export const CategoryClient = ({
  initialProducts,
  categoryId,
  itemPerPage,
}: CategoryClientProps) => {
  const locale = useLocale()
  const t = useTranslations('Products')
  const [selectedKeys, setSelectedKeys] = useState(new Set(['newest']))

  const sortBy = useMemo(() => {
    const key = Array.from(selectedKeys)[0] as keyof typeof SORT_ITEMS
    return SORT_ITEMS[key]
  }, [selectedKeys])

  const QUERY_KEY = {
    CATEGORY: ['category', categoryId],
    PRODUCTS: ['products', categoryId, sortBy?.label, sortBy?.order, locale],
  }

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: QUERY_KEY.CATEGORY,
    queryFn: () => getCategory(categoryId),
    enabled: !!categoryId,
  })

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<GetProductsResult>({
      queryKey: QUERY_KEY.PRODUCTS,
      initialPageParam: null,
      queryFn: ({ pageParam }) =>
        getProducts({
          cursor: pageParam as string | null,
          limit: itemPerPage,
          categoryId,
          sortBy,
          locale,
        }),
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      enabled: !!categoryId,
      placeholderData: (prev) =>
        prev ?? {
          pages: [initialProducts],
          pageParams: [null],
        },
    })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 300,
  })

  const totalItems = data?.pages?.[0]?.totalCount ?? 0
  const items = data?.pages?.flatMap((page) => page.items) ?? []
  const itemCount = items.length

  if (isLoading)
    return (
      <div className='flex items-center justify-center py-20'>
        <Spinner label={t('loading')} />
      </div>
    )

  if (totalItems === 0) return <PageNotFound>{t('notFound')}</PageNotFound>

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full flex-col gap-5 p-5'>
        <div className='container mx-auto flex w-full items-center justify-start'>
          {isLoadingCategory && <Skeleton className='h-10 w-64 rounded-lg' />}

          {!isLoadingCategory && (
            <Breadcrumbs className='font-semibold'>
              <BreadcrumbItem href='/'>{t('breadcrumbs.home')}</BreadcrumbItem>
              <BreadcrumbItem href='/products'>
                {t('breadcrumbs.products')}
              </BreadcrumbItem>
              <BreadcrumbItem>{category?.name}</BreadcrumbItem>
            </Breadcrumbs>
          )}
        </div>

        {isLoadingCategory && <Skeleton className='h-10 w-64 rounded-lg' />}

        {!isLoadingCategory && (
          <span className='container mx-auto text-2xl font-semibold'>
            {t('categoryTitle', { name: category?.name! })}
          </span>
        )}

        <div className='container mx-auto flex w-full flex-wrap items-center justify-center gap-3 sm:justify-between'>
          <span className='text-primary'>
            {t('pagination', { count: itemCount, total: totalItems })}
          </span>

          <Dropdown>
            <DropdownTrigger>
              <Button
                startContent={<ArrowUpDownIcon size={18} />}
                variant='bordered'
                color='primary'
              >
                {t('sortLabel')} {t(`sortItems.${Array.from(selectedKeys)[0]}`)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label='Product Sort'
              selectedKeys={selectedKeys}
              selectionMode='single'
              variant='flat'
              onSelectionChange={(keys) => {
                if (keys === 'all') return
                setSelectedKeys(new Set(keys as Set<string>))
              }}
            >
              {Object.entries(SORT_ITEMS).map(([key]) => (
                <DropdownItem key={key}>{t(`sortItems.${key}`)}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        <Divider />

        <ProductSection
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          itemPerPage={itemPerPage}
          items={items}
        />
      </div>

      {/* <div className='flex w-full flex-col'>
        <AdvertiseBanner />
        <CertificateBanner />
        <MarketplaceBanner />
        <CustomerBanner />
      </div> */}
    </section>
  )
}
