'use client'

import { Button } from '@heroui/react'
import { ChevronLeftIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import { TableConfigHeader } from '../../../products/_components/TableConfigHeader'
import { StockHistoryTable } from '../../_components/StockHistoryTable'

import { Container } from '@/components/layouts/Container'
import { useProductAdmin } from '@/features/product/hook'

const StockHistoryDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [page, setPage] = useState(1)

  const { data: product } = useProductAdmin(id!, true)

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <TableConfigHeader
        selectedCount={0}
        title={
          <div className='flex items-center gap-3'>
            <Button
              isIconOnly
              variant='light'
              onPress={() => router.push('/dashboard/inventory')}
            >
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>ความเคลื่อนไหวสต็อก</h1>
              <p>สินค้า: {product?.name}</p>
            </div>
          </div>
        }
      />

      <StockHistoryTable
        page={page}
        productId={id}
        onPageChange={(p) => {
          return setPage(p)
        }}
      />
    </Container>
  )
}

export default StockHistoryDetailPage
