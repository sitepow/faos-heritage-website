'use client'

import {
  Spinner,
  Breadcrumbs,
  BreadcrumbItem,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Divider,
} from '@heroui/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ArrowUpDownIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import { ProductSection } from '../product/[slug]/_components'

import {
  getProducts,
  type GetProductsResult,
} from '@/app/[locale]/(main)/products/action'
import { AdvertiseBanner, CertificateBanner } from '@/components'
import { PageNotFound } from '@/components/common/page-not-found'
import { CustomerBanner } from '@/components/features/banner/customer'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { SORT_ITEMS } from '@/utils/features'

interface ProductsClientProps {
  initialProducts: GetProductsResult
  itemPerPage: number
}

export const ProductsClient = ({
  initialProducts,
  itemPerPage,
}: ProductsClientProps) => {
  const t = useTranslations('Products')
  const [selectedKeys, setSelectedKeys] = useState(new Set(['newest']))

  const sortBy = useMemo(() => {
    const key = Array.from(selectedKeys)[0] as keyof typeof SORT_ITEMS
    return SORT_ITEMS[key]
  }, [selectedKeys])

  const QUERY_KEY = {
    PRODUCTS: ['products', sortBy?.label, sortBy?.order],
  }

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<GetProductsResult>({
      queryKey: QUERY_KEY.PRODUCTS,
      initialPageParam: null,
      queryFn: ({ pageParam }) =>
        getProducts({
          cursor: pageParam as string | null,
          limit: itemPerPage,
          sortBy,
        }),
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
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
      <div className='flex w-full justify-start'>
        <Breadcrumbs className='font-bold'>
          <BreadcrumbItem href='/'>{t('breadcrumbs.home')}</BreadcrumbItem>
          <BreadcrumbItem>{t('breadcrumbs.products')}</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <span className='text-2xl font-bold'>{t('title')}</span>

      <div className='flex w-full flex-wrap items-center justify-center gap-3 sm:justify-between'>
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

      <CertificateBanner />
      <AdvertiseBanner />
      <CustomerBanner />
    </section>
  )
}
