/* eslint-disable react/no-array-index-key */
'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Accordion,
  AccordionItem,
} from '@heroui/react'
import { PackageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { AffiliateDashboardData } from '@/features/affiliate/action'

import { useTranslateStatus } from '@/hooks/useTranslateStatus'
import { formatCurrency, formatDate } from '@/utils'

interface Props {
  commissions: AffiliateDashboardData['recentCommissions']
  isLoading: boolean
  currency?: string
}

const AffiliateCommissionTable = ({
  commissions,
  isLoading,
  currency = 'THB',
}: Props) => {
  const t = useTranslations('AffiliateCommissionTable')
  const { getPayoutStatusProps } = useTranslateStatus()

  return (
    <Table aria-label='Commission History Table'>
      <TableHeader>
        <TableColumn>{t('columns.date')}</TableColumn>
        <TableColumn width={250}>{t('columns.itemsOrder')}</TableColumn>
        <TableColumn>{t('columns.sales', { currency })}</TableColumn>
        <TableColumn>{t('columns.rate')}</TableColumn>
        <TableColumn>{t('columns.commission', { currency })}</TableColumn>
        <TableColumn align='center'>{t('columns.status')}</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={t('emptyContent')}
        isLoading={isLoading}
        loadingContent={<Spinner label={t('loadingContent')} />}
      >
        {commissions.map((item) => {
          const statusProps = getPayoutStatusProps(item.status)

          return (
            <TableRow key={item.id}>
              <TableCell className='max-w-64 min-w-64'>
                {formatDate(item.createdAt)}
              </TableCell>
              <TableCell className='max-w-64 min-w-64'>
                <Accordion isCompact className='px-0' variant='light'>
                  <AccordionItem
                    key='1'
                    aria-label={t('viewItems')}
                    startContent={
                      <PackageIcon className='text-default-400' size={14} />
                    }
                    title={
                      <span className='text-tiny font-bold'>
                        #{item.orderId.slice(-8).toUpperCase()}
                      </span>
                    }
                  >
                    <div className='flex flex-col gap-2 pb-2'>
                      {item.order?.items?.map((orderItem, idx: number) => {
                        return (
                          <div
                            key={idx}
                            className='text-default-500 border-default-50 flex justify-between border-b pb-1 text-[10px]'
                          >
                            <span className='line-clamp-1 flex-1'>
                              {orderItem.productName}{' '}
                              {orderItem.variantName &&
                                `(${orderItem.variantName})`}
                            </span>
                            <span className='ml-2 font-bold'>
                              x{orderItem.quantity}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionItem>
                </Accordion>
              </TableCell>
              <TableCell className='max-w-32 min-w-32'>
                {formatCurrency(Number(item.orderAmount))}
              </TableCell>
              <TableCell className='max-w-32 min-w-32'>
                {Number(item.appliedRate)}%
              </TableCell>
              <TableCell className='text-success font-bold'>
                {formatCurrency(Number(item.commissionAmount))}
              </TableCell>
              <TableCell>
                <Chip color={statusProps.color} size='sm' variant='dot'>
                  {statusProps.label}
                </Chip>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { AffiliateCommissionTable }
