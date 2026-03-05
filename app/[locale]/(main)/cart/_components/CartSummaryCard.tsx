/* eslint-disable react/no-unstable-nested-components */
'use client'

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  Input,
} from '@heroui/react'
import { Currency } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import type { ComponentProps } from 'react'

import { CartSummaryRow } from './CartSummaryRow'

import { useAppStore } from '@/app/store'
import { useDefaultAddress } from '@/features/address/address.hook'
import { useCarts } from '@/features/cart/hooks/useCart'
import { useExchangeRate } from '@/features/exchange-rate/exchange-rate.hook'
import { useOrderMutation } from '@/features/order/order.mutation'
import { useShipping } from '@/features/shipping/shipping.hook'
import { useAffiliate } from '@/hooks/useAffiliate'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'
import { formatFullAddress } from '@/utils'
import { cn } from '@/utils/style'

type Props = ComponentProps<typeof Card>

const CartSummaryCard = ({ className, ...props }: Props) => {
  const tCheckout = useTranslations('cart.checkout')
  const tAction = useTranslations('cart.checkout.action')
  const tSummary = useTranslations('cart.checkout.summary')

  const navigation = useAppNavigation()
  const { appLocale } = useAppStore()
  const locale = useLocale()
  const { userId } = useAuth()

  const { referralNo } = useAffiliate()
  const [referrerCode, setReferrerCode] = useState('')

  useEffect(() => {
    if (referralNo) {
      setReferrerCode(referralNo)
    }
  }, [referralNo])

  const {
    data: carts = [],
    subTotal,
    grossTotal,
    totalDiscount,
    totalWeight,
  } = useCarts({ userId, locale })

  const { data: address, isLoading: isLoadingAddress } = useDefaultAddress(
    userId!,
  )
  const { currencyOptions } = useExchangeRate()

  const { shippingCost } = useShipping({ userId, address, carts })

  const totalAmount = subTotal + shippingCost
  const currency = (appLocale?.currency as Currency) ?? Currency.THB
  const exchangeRate = currencyOptions.rates?.[currency] ?? 1

  const hasItems = carts.length > 0
  const canOrder = address && hasItems && userId

  const { createOrder, isCreating } = useOrderMutation()

  const handleOrder = async () => {
    if (!canOrder) {
      return
    }

    await createOrder({
      addressId: address.id,
      currency,
      exchangeRate,
      exchangeLocale: appLocale.locale,
      referrerId: referrerCode || undefined,
      items: carts.map(({ productId, variantId, quantity }) => ({
        productId,
        variantId,
        quantity,
      })),
    })
  }

  const renderAddressSection = () => {
    if (isLoadingAddress || !address) {
      return null
    }

    return (
      <div className='flex flex-col gap-2'>
        <span className='w-fit font-semibold'>{tCheckout('addressTitle')}</span>
        <Alert
          className='text-start'
          description={tCheckout('currencyAlert')}
          variant='bordered'
        />
        <div className='text-default-500 text-sm'>
          {formatFullAddress(address)}{' '}
          <button
            className='text-primary hover:text-primary-600 font-medium underline transition-colors'
            onClick={navigation.ADDRESS}
          >
            {tAction('editAddress')}
          </button>
        </div>
      </div>
    )
  }

  const renderReferrerSection = () => {
    if (referralNo) {
      return (
        <div className='bg-primary/5 border-primary/10 flex flex-col gap-2 rounded-lg border p-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>
              {tCheckout('referrerTitle')}:
            </span>
            <Chip
              className='font-mono font-bold'
              color='primary'
              radius='none'
              variant='dot'
            >
              {referralNo}
            </Chip>
          </div>
        </div>
      )
    }

    return (
      <div className='flex flex-col gap-2'>
        <span className='text-default-600 w-fit text-sm font-semibold'>
          {tCheckout('referrerTitle')}
        </span>
        <Input
          classNames={{
            input: 'text-center text-default-500 font-mono',
          }}
          placeholder={tCheckout('referrerPlaceholder')}
          radius='none'
          size='md'
          value={referrerCode}
          variant='bordered'
          onValueChange={(value) => {
            return setReferrerCode(value.toUpperCase())
          }}
        />
      </div>
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
      <CardBody className='gap-4'>
        {renderAddressSection()}

        <Divider className='bg-default-100/50' />

        {renderReferrerSection()}

        <Divider className='bg-default-100/50' />

        <div className='flex flex-col gap-3'>
          <span className='w-fit font-semibold'>
            {tCheckout('summaryTitle')}
          </span>

          <CartSummaryRow label={tSummary('total')} value={grossTotal} />
          <CartSummaryRow
            label={tSummary('weight')}
            type='weight'
            value={totalWeight}
          />
          <CartSummaryRow label={tSummary('shipping')} value={shippingCost} />

          {totalDiscount > 0 && (
            <CartSummaryRow
              label={tSummary('discount')}
              value={totalDiscount}
              variant='danger'
            />
          )}

          <CartSummaryRow
            label={tSummary('net')}
            value={totalAmount}
            variant='primary'
          />
        </div>
      </CardBody>

      <CardFooter className='flex-col gap-3'>
        {!isLoadingAddress && !address && (
          <Alert
            className='text-start'
            color='warning'
            description={
              <span>
                {tCheckout.rich('emptyAddressAlert', {
                  button: (chunks) => (
                    <button
                      className='cursor-pointer font-bold underline'
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

        {address && (
          <Button
            className='text-secondary w-full font-bold'
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
