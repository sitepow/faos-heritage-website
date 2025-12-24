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
import { useMemo, useState } from 'react'

import { ProductSection } from '../product/[slug]/components'

import {
  getProducts,
  type GetProductsResult,
} from '@/app/(main)/products/action'
import { AdvertiseBanner, CertificateBanner } from '@/components'
import { PageNotFound } from '@/components/common/page-not-found'
import { SORT_ITEMS } from '@/features'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface ProductsClientProps {
  initialProducts: GetProductsResult
  itemPerPage: number
}

export const ProductsClient = ({
  initialProducts,
  itemPerPage,
}: ProductsClientProps) => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['newest']))
  const sortBy = useMemo(() => {
    const key = Array.from(selectedKeys)[0] as keyof typeof SORT_ITEMS

    return SORT_ITEMS[key]
  }, [selectedKeys])

  const QUERY = {
    PRODUCTS: ['products', sortBy?.label, sortBy?.order],
  }

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<GetProductsResult>({
      queryKey: QUERY.PRODUCTS,
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
      <div className='flex items-center justify-center'>
        <Spinner label='Loading...' />
      </div>
    )

  if (totalItems === 0)
    return (
      <PageNotFound>
        We apologize, the product was not found in our system. Please try
        searching for the product again on the homepage.
      </PageNotFound>
    )

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full justify-start'>
        <Breadcrumbs className='font-bold'>
          <BreadcrumbItem>Homepage</BreadcrumbItem>
          <BreadcrumbItem>Products</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <span className='text-2xl font-bold'>Products</span>

      <div className='flex w-full flex-wrap items-center justify-center gap-3 sm:justify-between'>
        <span className='text-primary'>
          Showing 1–{itemCount} of {totalItems} items
        </span>

        <Dropdown>
          <DropdownTrigger>
            <Button startContent={<ArrowUpDownIcon />} variant='faded'>
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
