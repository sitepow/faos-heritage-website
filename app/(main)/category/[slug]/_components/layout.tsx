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
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ArrowUpDownIcon } from 'lucide-react'
import { useMemo, useState, type FC } from 'react'

import type { GetProductsResult } from '@/actions/product'

import { getProducts } from '@/actions/product'
import { getCategory } from '@/app/(dashboard)/dashboard/product/actions/category'
import { ProductSection } from '@/app/(main)/_components/section/product'
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

  const { data: category } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategory(categoryId),
    enabled: !!categoryId,
  })

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<GetProductsResult>({
      queryKey: ['products', categoryId, , sortBy?.label, sortBy?.order],
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
  const currentItems = data?.pages?.flatMap((page) => page.items) ?? []
  const currentItemCount = currentItems.length

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
          <BreadcrumbItem>{category?.name}</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <span className='text-2xl'>{category?.name}</span>

      <div className='flex w-full flex-wrap items-center justify-between gap-3'>
        <span className='text-primary-website'>
          สินค้ารายการที่ 1 – {currentItemCount} จากทั้งหมด {totalItems} รายการ
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
        items={currentItems}
      />
    </section>
  )
}

export { CategoryLayout }
