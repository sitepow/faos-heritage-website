'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Spinner } from '@heroui/spinner'
import { Switch } from '@heroui/switch'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ArrowUpDownIcon, Settings2Icon } from 'lucide-react'

import { ProductSection } from '../_components/section/product'

import { getProducts, type GetProductsResult } from '@/actions/product'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const ITEM_PER_PAGE = 8

const Products = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<GetProductsResult>({
      queryKey: ['products'],
      initialPageParam: null,
      queryFn: ({ pageParam }) =>
        getProducts({
          cursor: pageParam as string | null,
          limit: ITEM_PER_PAGE,
        }),
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
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

      <div className='flex w-full flex-wrap items-center justify-between gap-3'>
        <span className='text-primary-website'>
          สินค้ารายการที่ 1 – {itemCount} จากทั้งหมด {totalItems} รายการ
        </span>

        <div className='flex flex-wrap gap-3'>
          <Switch defaultSelected color='primary'>
            แสดงเฉพาะสินค้าพร้อมส่ง
          </Switch>

          <Button startContent={<Settings2Icon />} variant='bordered'>
            ตัวกรอง
          </Button>

          <Button startContent={<ArrowUpDownIcon />} variant='bordered'>
            การเรียงลำดับ
          </Button>
        </div>
      </div>

      <Divider />

      <ProductSection
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        itemPerPage={ITEM_PER_PAGE}
        items={items}
      />
    </section>
  )
}

export default Products
