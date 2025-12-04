'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Spinner } from '@heroui/spinner'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getProducts, type GetProductsResult } from '@/actions/product'
import { ProductSection } from '@/app/(main)/_components/section/product'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { SORT_MAP } from '@/utils/const'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { ArrowUpDownIcon } from 'lucide-react'
import { useMemo, useState, type FC } from 'react'

interface Props {
  initialProducts: GetProductsResult
  itemPerPage: number
}

const ProductClient: FC<Props> = ({ initialProducts, itemPerPage }) => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['newest']))

  const sortBy = useMemo(() => {
    const key = Array.from(selectedKeys)[0] as keyof typeof SORT_MAP

    return SORT_MAP[key]
  }, [selectedKeys])

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<GetProductsResult>({
      queryKey: ['products', sortBy?.label, sortBy?.order],
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
        <Spinner label='กำลังโหลด...' />
      </div>
    )

  if (totalItems === 0) return null

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full justify-start'>
        <Breadcrumbs className='font-bold'>
          <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
          <BreadcrumbItem>สินค้าทั้งหมด</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <span className='text-2xl'>สินค้าทั้งหมด</span>

      <div className='flex w-full flex-wrap items-center justify-center gap-3 sm:justify-between'>
        <span className='text-primary-website'>
          สินค้ารายการที่ 1 – {itemCount} จากทั้งหมด {totalItems} รายการ
        </span>

        <Dropdown>
          <DropdownTrigger>
            <Button
              startContent={<ArrowUpDownIcon className='text-default-500' />}
              variant='bordered'
            >
              การเรียงลำดับ {sortBy?.label}
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
    </section>
  )
}

export default ProductClient
