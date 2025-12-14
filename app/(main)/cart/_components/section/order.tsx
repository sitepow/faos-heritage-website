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
        toast.success(
          'Your order has been created. Please review and proceed with payment.',
        )

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
        description='Please confirm the accuracy of your product list and shipping address. If everything is correct, you can proceed with your order immediately.'
        isOpen={isOpenConfirmOrder}
        isPending={isPendingCreateOrder}
        title='Are you about to place an order??'
        onConfirm={onCreateOrder}
        onOpenChange={onOpenConfirmOrderChange}
      />

      <Card fullWidth className={cn(className, 'h-fit')} {...props}>
        <CardBody className='gap-3'>
          <span className='w-fit border-b border-primary-website pb-1 font-bold'>
            Discount code
          </span>

          <div className='flex items-center gap-2'>
            <Input isDisabled label='Discount code' variant='bordered' />
            <Button isDisabled variant='faded'>
              Use the discount
            </Button>
          </div>

          {!isLoadingAddress && !address && (
            <Alert
              description={
                <span>
                  Please add your shipping address before placing your order{' '}
                  <button
                    className='cursor-pointer text-primary-website underline'
                    onClick={GOTO.ADDRESS}
                  >
                    Add your address
                  </button>
                </span>
              }
              variant='bordered'
            />
          )}

          {!isLoadingAddress && address && (
            <>
              <span className='w-fit border-b border-primary-website pb-1 font-bold'>
                Shipping address
              </span>

              <span>
                {getFullAddress(address)}{' '}
                <button
                  className='cursor-pointer text-primary-website underline'
                  onClick={GOTO.ADDRESS}
                >
                  Edit address
                </button>
              </span>
            </>
          )}

          <span className='w-fit border-b border-primary-website pb-1 font-bold'>
            Payment details
          </span>

          <SummaryRow label='Total price' value={tempSubTotal} />
          <SummaryRow label='Shipping cost' value={tempShippingCost} />
          <SummaryRow label='discount' value={tempShippingCost} />

          <div className='flex items-center justify-between pt-1'>
            <span className='font-bold'>Net total price :</span>
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
            Order products
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
