/* eslint-disable react/no-unstable-nested-components */
'use client'

import { Alert, Button, Card, CardBody, CardFooter } from '@heroui/react'
import { Currency } from '@prisma/client'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { CartSummaryRow } from './CartSummaryRow'

import { useAppStore } from '@/app/store'
import { CURRENCY } from '@/constants'
import { useDefaultAddress } from '@/features/address/useAddress'
import { useCarts } from '@/features/cart/hooks/useCart'
import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import { useOrderMutation } from '@/features/order/order.mutation'
import { useShipping } from '@/features/shipping/useShipping'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatFullAddress } from '@/utils'
import { cn } from '@/utils/style'

type Props = ComponentProps<typeof Card>

const CartSummaryCard = ({ className, ...props }: Props) => {
  const tCheckout = useTranslations('cart.checkout')
  const tAction = useTranslations('cart.checkout.action')
  const tSummary = useTranslations('cart.checkout.summary')
  const navigation = useAppNavigation()
  const { appLocale } = useAppStore()

  const { userId } = useAuth()

  const { data: carts = [], subTotal } = useCarts({ userId })
  const { data: address, isLoading: isLoadingAddress } = useDefaultAddress(
    userId!,
  )
  const { data: exchangeRates, currencyOptions } = useExchangeRate()

  const currency: Currency = (appLocale?.currency as Currency) ?? Currency.THB
  const exchangeRate = exchangeRates?.[currency] ?? 1
  const { shippingCost } = useShipping({ userId, address, carts })
  const totalAmount = subTotal + shippingCost
  const hasItems = carts.length > 0
  const canOrder = address && hasItems && userId

  const { createOrder, isCreating } = useOrderMutation()

  const handleOrder = async () => {
    if (!canOrder) {
      return
    }

    await createOrder(
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
        onSuccess: navigation.ORDER,
      },
    )
  }

  const renderAddressSection = () => {
    if (isLoadingAddress || !address) {
      return null
    }

    return (
      <>
        <span className='w-fit font-semibold'>{tCheckout('addressTitle')}</span>
        <Alert
          className='text-start'
          description={tCheckout('currencyAlert')}
          variant='bordered'
        />
        <span className='text-default-500'>
          {formatFullAddress(address)}{' '}
          <button
            className='text-primary cursor-pointer underline'
            onClick={navigation.ADDRESS}
          >
            {tAction('editAddress')}
          </button>
        </span>
      </>
    )
  }

  return (
    <Card
      className={cn(
        'border-default-100 mx-auto border p-2.5 sm:w-xl sm:p-5',
        className,
      )}
      radius='sm'
      shadow='none'
      {...props}
    >
      <CardBody className='gap-3'>
        {renderAddressSection()}

        <span className='w-fit font-semibold'>{tCheckout('summaryTitle')}</span>

        <CartSummaryRow label={tSummary('total')} value={subTotal} />
        <CartSummaryRow label={tSummary('shipping')} value={shippingCost} />
        <CartSummaryRow label={tSummary('discount')} value={0} />

        <div className='flex items-center justify-between pt-1'>
          <span className='font-semibold'>{tSummary('net')} :</span>
          <span className='text-primary text-2xl font-semibold'>
            {formatCurrency(totalAmount, currencyOptions)}
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
                {tCheckout.rich('emptyAddressAlert', {
                  button: (chunks) => (
                    <button
                      className='cursor-pointer underline'
                      onClick={navigation.ADDRESS}
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
            isDisabled={!hasItems}
            isLoading={isCreating}
            radius='none'
            size='lg'
            onPress={handleOrder}
          >
            {tAction('order')}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export { CartSummaryCard }
