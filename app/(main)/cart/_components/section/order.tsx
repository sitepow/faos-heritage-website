'use client'

import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter } from '@heroui/card'
import { Input } from '@heroui/input'
import { useDisclosure } from '@heroui/modal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { toast } from 'react-toastify'

import type { ComponentProps, FC } from 'react'

import { useCartStore } from '../../store'

import { createOrder } from '@/actions/order'
import { getAddress } from '@/app/(main)/account/actions/address'
import { ModalConfirm } from '@/components/modal/confirm'
import { ACCOUNT_TAB } from '@/utils/const'
import { getFullAddress } from '@/utils/helper'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

const OrderSection: FC<ComponentProps<typeof Card>> = ({
  className,
  ...props
}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { carts } = useCartStore()
  const { isOpen: isOpenConfirmOrder, onOpenChange: onOpenConfirmOrderChange } =
    useDisclosure()

  const { tempSubTotal, tempShippingCost, tempTotal } = useMemo(() => {
    const tempSubTotal =
      carts?.reduce((sum, cart) => {
        const variants = cart?.product?.variants ?? []
        const variant = variants.find(
          (variant) => variant.id === cart?.variantId,
        )

        const price = variant?.price ?? cart?.product?.price ?? 0

        return sum + price * cart.quantity
      }, 0) ?? 0

    const tempShippingCost = 0
    const tempTotal = tempSubTotal + tempShippingCost

    return { tempSubTotal, tempShippingCost, tempTotal }
  }, [carts])

  const { data: session } = useSession()
  const userId = session?.user?.id

  const GOTO = {
    ADDRESS: () => router.push(`/account?tab=${ACCOUNT_TAB?.ACCOUNT}`),
    ORDER: () => router.push(`/account?tab=${ACCOUNT_TAB?.ORDER}`),
  }

  const QUERY = {
    ADDRESS: ['account', 'address', userId],
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'count', userId],
    ORDER: ['account', 'orders', userId],
  }

  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: QUERY.ADDRESS,
    queryFn: () => getAddress(userId!),
    enabled: !!userId,
  })

  const { mutate: mutateCreateOrder, isPending: isPendingCreateOrder } =
    useMutation({
      mutationFn: createOrder,
      onSuccess: async () => {
        toast.success('คำสั่งซื้อของคุณถูกสร้างขึ้นแล้ว โปรดตรวจสอบและชำระเงิน')

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY.CART }),
          queryClient.invalidateQueries({ queryKey: QUERY.CART_COUNT }),
          queryClient.invalidateQueries({ queryKey: QUERY.ORDER }),
        ])

        onOpenConfirmOrderChange()
        GOTO.ORDER()
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
    <div>
      <ModalConfirm
        description='โปรดยืนยันความถูกต้องของรายการสินค้าและที่อยู่จัดส่ง หากถูกต้องแล้วสามารถดำเนินการสั่งซื้อได้ทันที'
        isOpen={isOpenConfirmOrder}
        isPending={isPendingCreateOrder}
        title='คุณกำลังจะสั่งซื้อสินค้าหรือไม่?'
        onConfirm={onCreateOrder}
        onOpenChange={onOpenConfirmOrderChange}
      />

      <Card fullWidth className={cn(className, 'h-fit')} {...props}>
        <CardBody className='gap-3'>
          <span className='w-fit border-b border-primary-website pb-1 font-bold'>
            โค้ดส่วนลด
          </span>

          <div className='flex items-center gap-2'>
            <Input isDisabled label='โค้ดส่วนลด' variant='bordered' />
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
                    onClick={GOTO.ADDRESS}
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
                  onClick={GOTO.ADDRESS}
                >
                  แก้ไขที่อยู่
                </button>
              </span>
            </>
          )}

          <span className='w-fit border-b border-primary-website pb-1 font-bold'>
            รายละเอียดการชำระเงิน
          </span>

          <SummaryRow label='ราคารวม' value={tempSubTotal} />
          <SummaryRow label='ค่าจัดส่ง' value={tempShippingCost} />
          <SummaryRow label='ส่วนลด' value={tempShippingCost} />

          <div className='flex items-center justify-between pt-1'>
            <span className='font-bold'>ราคารวมสุทธิ :</span>
            <span className='text-2xl font-bold text-primary-website'>
              {formatCurrency(tempTotal)}
            </span>
          </div>
        </CardBody>

        <CardFooter>
          <Button
            fullWidth
            isDisabled={!address || carts?.length === 0}
            variant='faded'
            onClick={onOpenConfirmOrderChange}
          >
            สั่งซื้อสินค้า
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const SummaryRow = ({ label, value }: { label: string; value: number }) => (
  <div className='flex justify-between text-default-500'>
    <span>{label}</span>
    <span>{formatCurrency(value)}</span>
  </div>
)

export { OrderSection }
