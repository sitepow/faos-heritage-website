/* eslint-disable react/no-unstable-nested-components */
'use client'

import { Card, CardBody, CardFooter, Alert, Button } from '@heroui/react'
import { Currency } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { CartSummaryRow } from './CartSummaryRow'

import { useAppStore } from '@/app/store'
import { PROFILE_TABS, CURRENCY } from '@/constants'
import { useAddressByUserId } from '@/features/address/useAddress'
import { useCarts } from '@/features/cart/useCart'
import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import { useCreateOrder } from '@/features/order/useOrder'
import { useShipping } from '@/features/shipping/useShipping'
import { formatCurrency, formatFullAddress } from '@/utils'
import { cn } from '@/utils/style'

type CartCheckoutProps = ComponentProps<typeof Card>

const CartSummaryCard = ({ className, ...props }: CartCheckoutProps) => {
  const translateCheckout = useTranslations('cart.checkout')
  const translateAction = useTranslations('cart.checkout.action')
  const translateSummary = useTranslations('cart.checkout.summary')

  const router = useRouter()
  const ROUTER_PATHS = {
    ADDRESS: () => router.push(`/account?tab=${PROFILE_TABS?.ADDRESS}`),
    ORDER: () => router.push(`/account?tab=${PROFILE_TABS?.ORDER}`),
  }

  const userId = useSession()?.data?.user?.id
  const { data: carts = [], subTotal } = useCarts({ userId })
  const { currencyOptions } = useExchangeRate()

  const { appLocale } = useAppStore()
  const { data: exchangeRates } = useExchangeRate()
  const currency: Currency = (appLocale?.currency as Currency) ?? Currency.THB
  const exchangeRate = exchangeRates?.[currency] ?? 1

  const { data: address, isLoading: isLoadingAddress } = useAddressByUserId(
    userId!,
  )
  const { shippingCost } = useShipping({ userId, address, carts })
  const { mutate: onCreateOrder, isPending: isPendingCreateOrder } =
    useCreateOrder()

  const handleOrder = () => {
    if (!address || carts.length === 0 || !userId) {
      return
    }

    onCreateOrder(
      {
        addressId: address.id,
        userId: userId!,
        currency,
        exchangeRate,
        exchangeRateSource: CURRENCY.EXCHANGE_API_THB,
        exchangeLocale: appLocale.locale,
        items: carts.map(({ productId, variantId, quantity }) => ({
          productId,
          variantId,
          quantity,
        })),
      },
      {
        onSuccess: () => {
          ROUTER_PATHS.ORDER
        },
      },
    )
  }

  return (
    <Card
      className={cn(className, 'border-default-100 mx-auto w-xl border p-5')}
      radius='sm'
      shadow='none'
      {...props}
    >
      <CardBody className='gap-3'>
        {!isLoadingAddress && address && (
          <>
            <span className='w-fit font-semibold'>
              {translateCheckout('addressTitle')}
            </span>

            <Alert
              className='text-start'
              description={translateCheckout('currencyAlert')}
              variant='bordered'
            />

            <span className='text-default-500'>
              {formatFullAddress(address)}{' '}
              <button
                className='text-primary cursor-pointer underline'
                onClick={ROUTER_PATHS.ADDRESS}
              >
                {translateAction('editAddress')}
              </button>
            </span>
          </>
        )}

        <span className='w-fit font-semibold'>
          {translateCheckout('summaryTitle')}
        </span>

        <CartSummaryRow label={translateSummary('total')} value={subTotal} />
        <CartSummaryRow
          label={translateSummary('shipping')}
          value={shippingCost}
        />
        <CartSummaryRow label={translateSummary('discount')} value={0} />

        <div className='flex items-center justify-between pt-1'>
          <span className='font-semibold'>{translateSummary('net')} :</span>
          <span className='text-primary text-2xl font-semibold'>
            {formatCurrency(subTotal + shippingCost, currencyOptions)}
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
                {translateCheckout.rich('emptyAddressAlert', {
                  button: (chunks) => (
                    <button
                      className='cursor-pointer underline'
                      onClick={ROUTER_PATHS.ADDRESS}
                    >
                      {chunks}
                    </button>
                  ),
                })}
              </span>
            }
            variant='bordered'
          />
        )}

        {!isLoadingAddress && address && (
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={carts?.length === 0}
            isLoading={isPendingCreateOrder}
            radius='none'
            size='lg'
            onPress={handleOrder}
          >
            {translateAction('order')}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export { CartSummaryCard }
