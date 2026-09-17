/* eslint-disable no-unused-vars */
'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from '@heroui/react'
import { Role, OrderStatus } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { EllipsisVerticalIcon, CreditCardIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import type { getOrders } from '@/features/order/action'
import type { Selection } from '@heroui/react'
import type { ReactNode } from 'react'

import { createStripeCheckout } from '@/app/actions/stripe'
import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { IMAGE_FALLBACK } from '@/constants'
import { useIsMounted } from '@/hooks/useIsMounted'
import {
  formatCurrency,
  formatDate,
  ORDER_STATUS_COLOR_MAP,
  ORDER_STATUS_TH_MAP,
} from '@/utils'

type OrderItemType = Awaited<ReturnType<typeof getOrders>>['items'][number]

interface ActionItem {
  key: string
  label: string
  icon: ReactNode
  onClick: () => void
}

interface Props {
  orderList: OrderItemType[]
  isLoading: boolean
  page: number
  total: number
  selectedKeys: Selection
  onPageChange: (page: number) => void
  onSelectionChange: (keys: Selection) => void
  getActionItems: (id: string) => ActionItem[]
}

const OrderTable = ({
  orderList,
  isLoading,
  page,
  total,
  selectedKeys,
  onPageChange,
  onSelectionChange,
  getActionItems,
}: Props) => {
  const isMounted = useIsMounted()
  const { data: session } = useSession()
  const router = useRouter()

  const userRoles = (session?.user as { roles?: Role[] })?.roles || []
  const isPOSOnly =
    userRoles.includes(Role.POS) && !userRoles.includes(Role.ADMIN)

  const { mutate: mutateCheckout, isPending: isPendingCheckout } = useMutation({
    mutationFn: (orderId: string) =>
      createStripeCheckout({ orderId, callbackUrl: window.location.href }),
    onSuccess: (result) => {
      if (result.success && result.data?.checkoutUrl) {
        router.push(result.data.checkoutUrl)
      }
    },
  })

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='ตารางคำสั่งซื้อ'
        checkboxesProps={{
          classNames: {
            wrapper: 'after:bg-primary before:border-default-300',
            icon: 'text-white font-bold',
          },
        }}
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          <TableColumn>คำสั่งซื้อ</TableColumn>
          <TableColumn>ลูกค้า</TableColumn>
          <TableColumn>ยอดรวม (Base)</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn>วันที่สั่งซื้อ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่พบรายการคำสั่งซื้อ'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูลออเดอร์...' />}
        >
          {orderList.map((order) => {
            let actionItems = getActionItems(order.id)

            if (isPOSOnly) {
              actionItems = actionItems.filter(
                (item) =>
                  !item.key.toLowerCase().includes('status') &&
                  !item.key.toLowerCase().includes('update'),
              )
            }

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <span className='text-default-500 text-xs font-bold'>
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className='max-w-64 min-w-64'>
                  <User
                    avatarProps={{
                      src: order?.user?.image || IMAGE_FALLBACK.EMPTY,
                    }}
                    description={
                      <div className='flex flex-col gap-2'>
                        <span>{order?.user?.email ?? '-'}</span>
                        <span>{order?.shippingPhone ?? '-'}</span>
                      </div>
                    }
                    name={order.user?.name || 'ลูกค้าทั่วไป'}
                  />
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(order.total), {
                    currency: order.currency,
                    skipCalculation: true,
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    className='font-bold'
                    color={ORDER_STATUS_COLOR_MAP[order.status as OrderStatus]}
                    size='sm'
                    variant='dot'
                  >
                    {ORDER_STATUS_TH_MAP[order.status as OrderStatus]}
                  </Chip>
                </TableCell>
                <TableCell className='text-default-500 text-small max-w-64 min-w-64'>
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        isLoading={isPendingCheckout}
                        size='sm'
                        variant='light'
                      >
                        <EllipsisVerticalIcon
                          className='text-default-500'
                          size={20}
                        />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='Order Actions' variant='flat'>
                      {[
                        ...(order.status === OrderStatus.PENDING
                          ? [
                              {
                                key: 'stripe-payment',
                                label: 'ชำระเงินผ่าน Stripe',
                                icon: (
                                  <CreditCardIcon
                                    className='text-primary'
                                    size={16}
                                  />
                                ),
                                onClick: () => mutateCheckout(order.id),
                              },
                            ]
                          : []),
                        ...actionItems,
                      ].map((item) => (
                        <DropdownItem
                          key={item.key}
                          className={
                            item.key === 'stripe-payment'
                              ? 'text-primary font-bold'
                              : ''
                          }
                          startContent={item.icon}
                          onPress={item.onClick}
                        >
                          {item.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <PaginationWrapper page={page} total={total} onChange={onPageChange} />
    </div>
  )
}

export { OrderTable }
