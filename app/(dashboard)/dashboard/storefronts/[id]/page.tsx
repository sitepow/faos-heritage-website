'use client'

import { Button, Link } from '@heroui/react'
import { ArrowLeftIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { StorefrontInventoryTable } from '../_components/StorefrontInventoryTable'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useStorefronts } from '@/features/storefront/hook'
import { useStorefrontInventories } from '@/features/storefront-inventory/hook'

const StorefrontDetailPage = () => {
  const params = useParams()
  const storefrontId = params.id as string

  const { data: storefrontList = [] } = useStorefronts()
  const currentStore = storefrontList.find((s) => s.id === storefrontId)

  const { data: inventoryList = [], isLoading } = useStorefrontInventories({
    storefrontId,
  })

  const statsData = useMemo(() => {
    return [
      { name: 'รายการสินค้าในร้าน', value: inventoryList.length },
      {
        name: 'มูลค่าสต็อกรวม (Net)',
        value: inventoryList.reduce((acc, curr) => {
          return acc + Number(curr.netPrice) * curr.stockQuantity
        }, 0),
      },
      {
        name: 'สินค้าใกล้หมด',
        value: inventoryList.filter((i) => i.stockQuantity < 5).length,
      },
    ]
  }, [inventoryList])

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <div className='flex items-center gap-4'>
        <Button
          isIconOnly
          as={Link}
          href='/dashboard/storefronts'
          variant='flat'
        >
          <ArrowLeftIcon size={18} />
        </Button>
        <div>
          <h1 className='text-2xl font-bold'>
            {currentStore?.name ?? 'จัดการสต็อกสาขา'}
          </h1>
          <p className='text-default-500 text-sm'>
            จัดการสินค้า สต็อก และราคาส่งรายสาขา
          </p>
        </div>
      </div>

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => (
          <StatCard key={stat.name} label={stat.name} value={stat?.value!} />
        ))}
      </div>

      <StorefrontInventoryTable
        inventoryList={inventoryList}
        isLoading={isLoading}
        storefrontId={storefrontId}
      />
    </Container>
  )
}

export default StorefrontDetailPage
