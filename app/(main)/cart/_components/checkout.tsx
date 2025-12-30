'use client'

import {
  Card,
  useDisclosure,
  CardBody,
  CardFooter,
  Alert,
  Button,
} from '@heroui/react'
import { Currency } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { toast } from 'react-toastify'

import type { ComponentProps } from 'react'

import { getAddressCheckout } from '../../account'

import { calculateShippingCost } from '@/app/(dashboard)'
import { createOrder } from '@/app/(main)/account/_components/order/action'
import { useCartStore } from '@/app/(main)/cart/store'
import { useAppStore } from '@/app/store'
import { ConfirmModal } from '@/components/modal/confirm'
import { EXCHANGE_RATE_API } from '@/utils/constants'
import { ACCOUNT_TAB } from '@/utils/features'
import { getFullAddress } from '@/utils/features/account/helpers'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

type CartCheckoutProps = ComponentProps<typeof Card>
type SummaryRowProps = {
  label: string
  value: number
  options?: {
    currency?: string
    locale?: string
    rates?: Record<string, number> | null
  }
}

const SummaryRow = ({ label, value, options }: SummaryRowProps) => (
  <div className='text-default-500 flex justify-between'>
    <span>{label}</span>
    <span>
      {formatCurrency(value, {
        currency: options?.currency,
        locale: options?.locale,
        rates: options?.rates,
      })}
    </span>
  </div>
)

export const CartCheckout = ({ className, ...props }: CartCheckoutProps) => {
  const { country, exchangeRates } = useAppStore()
  const CURRENCY_OPTIONS = {
    currency: country?.currency,
    locale: country?.locale,
    rates: exchangeRates,
  }
  const currency: Currency = (country?.currency as Currency) ?? Currency.USD
  const exchangeRate = exchangeRates?.[currency] ?? 1

  // const tomorrow = new Date()
  // tomorrow.setDate(tomorrow.getDate() + 1)

  const router = useRouter()
  const queryClient = useQueryClient()

  const { carts } = useCartStore()
  const { isOpen: isOpenConfirmOrder, onOpenChange: onOpenConfirmOrderChange } =
    useDisclosure()

  const subTotal = useMemo(() => {
    return (
      carts?.reduce((sum, cart) => {
        const variants = cart?.product?.variants ?? []
        const variant = variants.find(
          (variant) => variant.id === cart?.variantId,
        )

        const price = variant?.price ?? cart?.product?.price ?? 0

        return sum + price * cart.quantity
      }, 0) ?? 0
    )
  }, [carts])

  const { data: session } = useSession()
  const userId = session?.user?.id

  const GOTO = {
    ADDRESS: () => router.push(`/account?tab=${ACCOUNT_TAB?.ADDRESS}`),
    ORDER: () => router.push(`/account?tab=${ACCOUNT_TAB?.ORDER}`),
  }

  const QUERY_KEY = {
    ADDRESS_CHECKOUT: ['account', 'address', 'checkout', userId],
    SHIPPING_COST: ['shipping', 'carts', userId],
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'count', userId],
    ORDER: ['account', 'orders', 'pagination', userId],
  }

  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: QUERY_KEY.ADDRESS_CHECKOUT,
    queryFn: () => getAddressCheckout(userId!),
    enabled: !!userId,
  })

  const { data: shippingCost = 0, isLoading: isLoadingShippingCost } = useQuery(
    {
      queryKey: ['shipping', carts, userId, address?.countryCode],
      queryFn: () =>
        calculateShippingCost({
          countryCode: address!.countryCode,
          items: carts.map((cart) => ({
            quantity: cart.quantity,
            weight:
              cart.product?.variants?.find(
                (variant) => variant.id === cart.variantId,
              )?.weight ??
              cart.product?.weight ??
              0,
          })),
        }),
      enabled: !!address && !!carts?.length,
    },
  )

  const { mutate: mutateCreateOrder, isPending: isPendingCreateOrder } =
    useMutation({
      mutationFn: createOrder,
      onSuccess: async () => {
        toast.success(
          'Your order has been created. Please review and proceed with payment.',
        )

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY_KEY.CART }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEY.CART_COUNT }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEY.ORDER }),
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
      currency,
      exchangeRate,
      exchangeRateSource: EXCHANGE_RATE_API,
      exchangeLocale: country?.locale!,
      items: (carts ?? []).map((cart) => ({
        productId: cart.productId,
        variantId: cart.variantId ?? null,
        quantity: cart.quantity,
      })),
    })
  }

  return (
    <div>
      <ConfirmModal
        description='Please confirm the accuracy of your product list and shipping address. If everything is correct, you can proceed with your order immediately.'
        isOpen={isOpenConfirmOrder}
        isPending={isPendingCreateOrder}
        title='Are you about to place an order?'
        onConfirm={onCreateOrder}
        onOpenChange={onOpenConfirmOrderChange}
      />

      <Card fullWidth className={cn(className, 'h-fit')} {...props}>
        <CardBody className='gap-3'>
          {!isLoadingAddress && address && (
            <>
              <span className='border-primary w-fit border-b pb-1 font-bold'>
                Shipping address
              </span>

              <span className='text-default-500'>
                {getFullAddress(address)}{' '}
                <button
                  className='text-primary cursor-pointer underline'
                  onClick={GOTO.ADDRESS}
                >
                  Edit address
                </button>
              </span>
            </>
          )}

          <span className='border-primary w-fit border-b pb-1 font-bold'>
            Payment details
          </span>

          <SummaryRow
            label='Total price'
            value={subTotal}
            options={CURRENCY_OPTIONS}
          />
          <SummaryRow
            label='Shipping cost'
            value={shippingCost}
            options={CURRENCY_OPTIONS}
          />
          <SummaryRow label='discount' value={0} options={CURRENCY_OPTIONS} />

          <div className='flex items-center justify-between pt-1'>
            <span className='font-bold'>Net total price :</span>
            <span className='text-primary text-2xl font-bold'>
              {formatCurrency(subTotal + shippingCost, CURRENCY_OPTIONS)}
            </span>
          </div>
        </CardBody>

        <CardFooter className='flex-col gap-2'>
          {!isLoadingAddress && !address && (
            <Alert
              className='text-start'
              color='warning'
              description={
                <span>
                  Please add your shipping address before placing your order{' '}
                  <button
                    className='cursor-pointer underline'
                    onClick={GOTO.ADDRESS}
                  >
                    Add your address
                  </button>
                </span>
              }
              variant='bordered'
            />
          )}

          {/* <Alert
            className='text-start'
            color='warning'
            description={`We are updating our payment system. Sorry for the inconvenience. Orders will be available again on Sat Dec 27 2025 15:06:40 GMT+0700 (Indochina Time).`}
            variant='bordered'
          /> */}

          {!isLoadingAddress && address && (
            <Button
              className='text-secondary'
              color='primary'
              endContent={<ArrowRight />}
              isDisabled={
                !address || carts?.length === 0 || isLoadingShippingCost
              }
              onClick={onOpenConfirmOrderChange}
            >
              Proceed to checkout
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
