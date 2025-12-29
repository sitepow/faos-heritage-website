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
import { useMemo, useState } from 'react'

import type { GetProductsResult } from '@/app/(main)/products'

import { ProductSection } from '../../product'

import { getCategory } from '@/app/(dashboard)/dashboard/product'
import { getProducts } from '@/app/(main)/products'
import { AdvertiseBanner, CertificateBanner } from '@/components'
import { PageNotFound } from '@/components/common/page-not-found'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { SORT_ITEMS } from '@/utils/features'

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
  const [selectedKeys, setSelectedKeys] = useState(new Set(['newest']))
  const sortBy = useMemo(() => {
    const key = Array.from(selectedKeys)[0] as keyof typeof SORT_ITEMS

    return SORT_ITEMS[key]
  }, [selectedKeys])

  const QUERY_KEY = {
    CATEGORY: ['category', categoryId],
    PRODUCTS: ['products', categoryId, sortBy?.label, sortBy?.order],
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
      <div className='flex items-center justify-center'>
        <Spinner label='Loading...' />
      </div>
    )

  if (totalItems === 0)
    return (
      <PageNotFound>
        Sorry! Product category Nothing matches. Please try searching for new
        products on the homepage.
      </PageNotFound>
    )

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full items-center justify-start'>
        {isLoadingCategory && <Skeleton className='h-10 w-64 rounded-lg' />}

        {!isLoadingCategory && (
          <Breadcrumbs className='font-bold'>
            <BreadcrumbItem href='/'>Home</BreadcrumbItem>
            <BreadcrumbItem href='/products'>Products</BreadcrumbItem>
            <BreadcrumbItem>{category?.name}</BreadcrumbItem>
          </Breadcrumbs>
        )}
      </div>

      {isLoadingCategory && <Skeleton className='h-10 w-64 rounded-lg' />}

      {!isLoadingCategory && (
        <span className='text-2xl font-bold'>{category?.name}</span>
      )}

      <div className='flex w-full flex-wrap items-center justify-center gap-3 sm:justify-between'>
        <span className='text-primary'>
          Showing 1–{itemCount} of {totalItems} items
        </span>

        <Dropdown>
          <DropdownTrigger>
            <Button
              startContent={<ArrowUpDownIcon />}
              variant='bordered'
              color='primary'
            >
              Sorting {sortBy?.label}
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
            {Object.entries(SORT_ITEMS).map(([key, value]) => (
              <DropdownItem key={key}>{value.label}</DropdownItem>
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
    </section>
  )
}
