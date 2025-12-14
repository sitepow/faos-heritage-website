'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import { Spinner } from '@heroui/spinner'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ArrowUpDownIcon } from 'lucide-react'
import { useMemo, useState, type FC } from 'react'

import { getProducts, type GetProductsResult } from '@/actions/product'
import { ProductSection } from '@/app/(main)/_components/section/product'
import { NotFound } from '@/components/not-found'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { SORT_MAP } from '@/utils/const'

interface Props {
  initialProducts: GetProductsResult
  itemPerPage: number
}

const ProductLayout: FC<Props> = ({ initialProducts, itemPerPage }) => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['newest']))
  const sortBy = useMemo(() => {
    const key = Array.from(selectedKeys)[0] as keyof typeof SORT_MAP

    return SORT_MAP[key]
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
      <NotFound>
        We apologize, the product was not found in our system. Please try
        searching for the product again on the homepage.
      </NotFound>
    )

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full justify-start'>
        <Breadcrumbs className='font-bold'>
          <BreadcrumbItem>Homepage</BreadcrumbItem>
          <BreadcrumbItem>All products</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <span className='text-2xl'>All products</span>

      <div className='flex w-full flex-wrap items-center justify-center gap-3 sm:justify-between'>
        <span className='text-primary-website'>
          Item number 1 – {itemCount} From all {totalItems} list
        </span>

        <Dropdown>
          <DropdownTrigger>
            <Button
              startContent={<ArrowUpDownIcon className='text-default-500' />}
              variant='bordered'
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
            {Object.entries(SORT_MAP).map(([key, value]) => (
              <DropdownItem
                key={key}
                startContent={<ArrowUpDownIcon className='text-default-500' />}
              >
                {value.label}
              </DropdownItem>
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
    </section>
  )
}

export { ProductLayout }
