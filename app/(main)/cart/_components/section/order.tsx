'use client'

import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter } from '@heroui/card'
import { Input } from '@heroui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { toast } from 'react-toastify'

import type { ComponentProps, FC } from 'react'

import { useCartStore } from '../../store'

import { createOrder } from '@/actions/order'
import { getAddress } from '@/app/(main)/account/actions/address'
import { ACCOUNT_TABS } from '@/utils/const'
import { getFullAddress } from '@/utils/helper'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

const OrderSection: FC<ComponentProps<typeof Card>> = ({
  className,
  ...props
}) => {
  const queryClient = useQueryClient()
  const { carts } = useCartStore()

  const router = useRouter()

  const goToAddress = () => {
    router.push(`/account?tab=${ACCOUNT_TABS?.ACCOUNT}`)
  }
  const goToOrder = () => {
    router.push(`/account?tab=${ACCOUNT_TABS?.ORDER}`)
  }

  const { data: session } = useSession()
  const userId = session?.user?.id

  const ADDRESS_QUERY_KEY = ['account', 'address', userId]
  const CART_QUERY_KEY = ['carts', userId]
  const CART_COUNT_QUERY_KEY = ['carts', 'count', userId]
  const ORDER_QUERY_KEY = ['account', 'orders', userId]

  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: () => getAddress(userId!),
    enabled: !!userId,
  })

  const { subTotal, shippingCost, total } = useMemo(() => {
    const subTotal =
      carts?.reduce((sum, cart) => {
        const variants = cart?.product?.variants ?? []
        const variant = variants.find(
          (variant) => variant.id === cart?.variantId,
        )

        const price = variant?.price ?? cart?.product?.price ?? 0

        return sum + price * cart.quantity
      }, 0) ?? 0

    const shippingCost = 0
    const total = subTotal + shippingCost

    return { subTotal, shippingCost, total }
  }, [carts])

  const { mutate: mutateCreateOrder, isPending: isPendingCreateOrder } =
    useMutation({
      mutationFn: createOrder,
      onSuccess: async () => {
        toast.success(
          'คำสั่งซื้อของคุณถูกสร้างขึ้นแล้ว โปรดตรวจสอบและชำระเงินผ่าน Stripe',
        )

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: CART_COUNT_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY }),
        ])

        goToOrder()
      },
    })

  const onCreateOrder = () => {
    if (!address || !carts) return

    mutateCreateOrder({
      addressId: address.id,
      userId: userId!,
      items: (carts ?? []).map((cart) => {
        const { productId, variantId, quantity } = cart

        return {
          productId,
          variantId: variantId!,
          quantity,
        }
      }),
    })
  }

  return (
    <Card fullWidth className={cn(className, 'h-fit')} {...props}>
      <CardBody className='gap-3'>
        <span className='w-fit border-b border-primary-website pb-1 font-bold'>
          โค้ดส่วนลด
        </span>

        <div className='flex items-center gap-2'>
          <Input isDisabled label='โค้ดส่วนลด' />
          <Button isDisabled variant='faded'>
            ใช้ส่วนลด
          </Button>
        </div>

        {!isLoadingAddress && !address && (
          <Alert
            description={
              <span>
                กรุณาเพิ่มที่อยู่สำหรับการจัดส่งก่อนทำการสั่งซื้อสินค้า{' '}
                <button
                  className='cursor-pointer text-primary-website underline'
                  onClick={goToAddress}
                >
                  เพิ่มที่อยู่ของคุณ
                </button>
              </span>
            }
            variant='bordered'
          />
        )}

        {!isLoadingAddress && address && (
          <>
            <span className='w-fit border-b border-primary-website pb-1 font-bold'>
              ที่อยู่สำหรับจัดส่ง
            </span>

            <span>
              {getFullAddress(address)}{' '}
              <button
                className='cursor-pointer text-primary-website underline'
                onClick={goToAddress}
              >
                แก้ไขที่อยู่
              </button>
            </span>
          </>
        )}

        <span className='w-fit border-b border-primary-website pb-1 font-bold'>
          รายละเอียดการชำระเงิน
        </span>

        <SummaryRow label='ราคารวม' value={subTotal} />
        <SummaryRow label='ค่าจัดส่ง' value={shippingCost} />
        <SummaryRow label='ส่วนลด' value={shippingCost} />

        <div className='flex items-center justify-between pt-1'>
          <span className='font-bold'>ราคารวมสุทธิ :</span>
          <span className='text-2xl font-bold text-primary-website'>
            {formatCurrency(total)}
          </span>
        </div>
      </CardBody>

      <CardFooter>
        <Button
          fullWidth
          isDisabled={!address || carts?.length === 0}
          isLoading={isPendingCreateOrder}
          variant='faded'
          onClick={onCreateOrder}
        >
          สั่งซื้อสินค้า
        </Button>
      </CardFooter>
    </Card>
  )
}

const SummaryRow = ({ label, value }: { label: string; value: number }) => (
  <div className='flex justify-between text-default-500'>
    <span>{label}</span>
    <span>{formatCurrency(value)}</span>
  </div>
)

export { OrderSection }
