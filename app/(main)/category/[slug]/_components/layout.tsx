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
import { Skeleton } from '@heroui/skeleton'
import { Spinner } from '@heroui/spinner'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ArrowUpDownIcon } from 'lucide-react'
import { useMemo, useState, type FC } from 'react'

import type { GetProductsResult } from '@/actions/product'

import { getProducts } from '@/actions/product'
import { getCategory } from '@/app/(dashboard)/dashboard/product/actions/category'
import { ProductSection } from '@/app/(main)/_components/section/product'
import { NotFound } from '@/components/not-found'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { SORT_MAP } from '@/utils/const'

interface Props {
  initialProducts: GetProductsResult
  categoryId: string
  itemPerPage: number
}

const CategoryLayout: FC<Props> = ({
  initialProducts,
  categoryId,
  itemPerPage,
}) => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['newest']))
  const sortBy = useMemo(() => {
    const key = Array.from(selectedKeys)[0] as keyof typeof SORT_MAP

    return SORT_MAP[key]
  }, [selectedKeys])

  const QUERY = {
    CATEGORY: ['category', categoryId],
    PRODUCTS: ['products', categoryId, , sortBy?.label, sortBy?.order],
  }

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: QUERY.CATEGORY,
    queryFn: () => getCategory(categoryId),
    enabled: !!categoryId,
  })

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<GetProductsResult>({
      queryKey: QUERY.PRODUCTS,
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
        <Spinner label='กำลังโหลด...' />
      </div>
    )

  if (totalItems === 0)
    return (
      <NotFound>
        ขออภัยครับ! รหัสหมวดหมู่สินค้า{' '}
        <span className='text-primary-website'>&quot;{categoryId}&quot;</span>{' '}
        ไม่ตรงกับสิ่งใดเลย โปรดลองหาสินค้าใหม่ได้ที่หน้าหลัก
      </NotFound>
    )

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full items-center justify-start'>
        {isLoadingCategory && <Skeleton className='h-10 w-64 rounded-lg' />}

        {!isLoadingCategory && (
          <Breadcrumbs className='font-bold'>
            <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
            <BreadcrumbItem>{category?.name}</BreadcrumbItem>
          </Breadcrumbs>
        )}
      </div>

      {isLoadingCategory && <Skeleton className='h-10 w-64 rounded-lg' />}

      {!isLoadingCategory && <span className='text-2xl'>{category?.name}</span>}

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

export { CategoryLayout }
