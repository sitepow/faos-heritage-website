'use client'

import { Button } from '@heroui/react'
import { ReviewStatus } from '@prisma/client'
import { CheckIcon, XIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import type { Selection } from '@heroui/react'

import { ReviewTable } from './_components/ReviewTable'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useReviewsAdmin, useReviewStats } from '@/features/review/review.hook'
import { useReviewMutation } from '@/features/review/review.mutation'

const ReviewPage = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  const { data: stats } = useReviewStats()
  const { data, isLoading } = useReviewsAdmin()
  const { moderate } = useReviewMutation()

  const reviewList = useMemo(() => {
    return data && 'items' in data ? data.items : []
  }, [data])

  const statsData = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return reviewList.length
    }
    return selectedKeys.size
  }, [selectedKeys, reviewList])

  const selectedReviewIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return reviewList.map((r) => r.id)
    }
    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, reviewList])

  const handleModerateBulk = useCallback(
    async (status: ReviewStatus) => {
      await Promise.all(
        selectedReviewIds.map((id) =>
          moderate({
            id,
            status,
            comment: reviewList.find((r) => r.id === id)?.comment || '',
          }),
        ),
      )
      setSelectedKeys(new Set([]))
    },
    [selectedReviewIds, moderate, reviewList],
  )

  const getActionItems = useCallback(
    (review: any) => [
      {
        key: 'approve',
        label: 'อนุมัติ',
        icon: <CheckIcon className='text-success' size={16} />,
        onClick: () =>
          moderate({
            id: review.id,
            status: ReviewStatus.APPROVED,
            comment: review.comment || '',
          }),
      },
      {
        key: 'reject',
        label: 'ไม่อนุมัติ',
        icon: <XIcon size={16} />,
        isDanger: true,
        onClick: () =>
          moderate({
            id: review.id,
            status: ReviewStatus.REJECTED,
            comment: review.comment || '',
          }),
      },
    ],
    [moderate],
  )

  return (
    <Container className='flex flex-col gap-6'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => (
          <StatCard key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </div>

      <TableConfigHeader
        bulkActions={
          <div className='flex gap-2'>
            <Button
              color='danger'
              size='sm'
              startContent={<XIcon size={16} />}
              variant='flat'
              onPress={() => handleModerateBulk(ReviewStatus.REJECTED)}
            >
              ปฏิเสธที่เลือก ({selectedCount})
            </Button>
            <Button
              color='success'
              size='sm'
              startContent={<CheckIcon size={16} />}
              variant='flat'
              onPress={() => handleModerateBulk(ReviewStatus.APPROVED)}
            >
              อนุมัติที่เลือก ({selectedCount})
            </Button>
          </div>
        }
        selectedCount={selectedCount}
        title='จัดการรีวิวสินค้า'
      />

      <ReviewTable
        getActionItems={getActionItems}
        isLoading={isLoading}
        reviewList={reviewList}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </Container>
  )
}

export default ReviewPage
