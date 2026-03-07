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
  RadioGroup,
  Radio,
  Select,
  SelectItem,
} from '@heroui/react'
import { Currency, DeliveryType } from '@prisma/client'
import { TruckIcon, StoreIcon } from 'lucide-react'
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
import { useActiveStorefronts } from '@/features/storefront/storefront.hook'
import { useAffiliate } from '@/hooks/useAffiliate'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'
import { useIsBelowBreakpoint } from '@/hooks/useIsBelowBreakpoint'
import { formatFullAddress } from '@/utils'
import { cn } from '@/utils/style'

type Props = ComponentProps<typeof Card>

const CartSummaryCard = ({ className, ...props }: Props) => {
  const isMobile = useIsBelowBreakpoint('640px')

  const tCheckout = useTranslations('cart.checkout')
  const tAction = useTranslations('cart.checkout.action')
  const tSummary = useTranslations('cart.checkout.summary')

  const navigation = useAppNavigation()
  const { appLocale } = useAppStore()
  const locale = useLocale()
  const { userId } = useAuth()

  const { referralNo } = useAffiliate()
  const [referrerCode, setReferrerCode] = useState('')

  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    DeliveryType.SHIPPING,
  )
  const [selectedStoreId, setSelectedStoreId] = useState<string>('')

  const { data: storefronts = [], isLoading: isLoadingStores } =
    useActiveStorefronts()

  const hasStorefronts = storefronts.length > 0

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

  const { shippingCost: calculatedShipping } = useShipping({
    userId,
    address,
    carts,
  })
  const shippingCost =
    deliveryType === DeliveryType.PICKUP ? 0 : calculatedShipping

  const totalAmount = subTotal + shippingCost
  const currency = (appLocale?.currency as Currency) ?? Currency.THB
  const exchangeRate = currencyOptions.rates?.[currency] ?? 1

  const hasItems = carts.length > 0

  const canOrder =
    hasItems &&
    userId &&
    ((deliveryType === DeliveryType.SHIPPING && address) ||
      (deliveryType === DeliveryType.PICKUP && selectedStoreId))

  const { createOrder, isCreating } = useOrderMutation()

  const handleOrder = async () => {
    if (!canOrder) {
      return
    }

    return await createOrder({
      deliveryType,
      addressId:
        deliveryType === DeliveryType.SHIPPING ? address?.id : undefined,
      storefrontId:
        deliveryType === DeliveryType.PICKUP ? selectedStoreId : undefined,
      currency,
      exchangeRate,
      exchangeLocale: appLocale.locale,
      referrerId: referrerCode || undefined,
      items: carts.map(({ productId, variantId, quantity }) => {
        return {
          productId,
          variantId,
          quantity,
        }
      }),
    })
  }

  const renderDeliverySelector = () => {
    return (
      <div className='flex flex-col gap-3'>
        <span className='font-semibold'>
          {tCheckout('deliveryMethodTitle') || 'วิธีการรับสินค้า'}
        </span>
        <RadioGroup
          className='gap-5'
          orientation={isMobile ? 'vertical' : 'horizontal'}
          value={deliveryType}
          onValueChange={(val) => {
            return setDeliveryType(val as DeliveryType)
          }}
        >
          <div
            className={cn(
              'flex w-full gap-3',
              isMobile ? 'flex-col' : 'flex-row flex-wrap',
            )}
          >
            <Radio
              classNames={{
                base: cn(
                  'data-[selected=true]:border-primary bg-default-50 m-0 max-w-full rounded-lg border-2 border-transparent p-2 transition-all',
                  isMobile ? 'w-full' : 'min-w-[140px] flex-1',
                ),
              }}
              value={DeliveryType.SHIPPING}
            >
              <div className='flex items-center gap-2 text-left text-sm'>
                <TruckIcon size={16} />
                <span>{tCheckout('shippingOption') || 'จัดส่ง'}</span>
              </div>
            </Radio>

            <Radio
              classNames={{
                base: cn(
                  'data-[selected=true]:border-primary bg-default-50 m-0 max-w-full rounded-lg border-2 border-transparent p-2 transition-all',
                  isMobile ? 'w-full' : 'min-w-[140px] flex-1',
                ),
              }}
              isDisabled={!hasStorefronts || isLoadingStores}
              value={DeliveryType.PICKUP}
            >
              <div className='flex items-center gap-2 text-left text-sm'>
                <StoreIcon size={16} />
                <span>{tCheckout('pickupOption') || 'รับหน้าร้าน'}</span>
              </div>
            </Radio>
          </div>
        </RadioGroup>

        {deliveryType === DeliveryType.PICKUP && hasStorefronts && (
          <Select
            className='mt-1 w-full'
            label={tCheckout('selectStoreLabel') || 'เลือกสาขา'}
            radius='none'
            selectedKeys={selectedStoreId ? [selectedStoreId] : []}
            size='sm'
            variant='bordered'
            onChange={(e) => {
              return setSelectedStoreId(e.target.value)
            }}
          >
            {storefronts.map((store) => {
              return (
                <SelectItem key={store.id} textValue={store.name}>
                  <div className='flex flex-col overflow-hidden text-left'>
                    <span className='truncate text-sm font-bold'>
                      {store.name}
                    </span>
                    <span className='text-tiny text-default-400 line-clamp-1'>
                      {store.address}
                    </span>
                  </div>
                </SelectItem>
              )
            })}
          </Select>
        )}
      </div>
    )
  }

  const renderAddressSection = () => {
    if (isLoadingAddress || !address) {
      return null
    }

    return (
      <div className='flex flex-col gap-2 overflow-hidden'>
        <span className='w-fit text-left font-semibold'>
          {tCheckout('addressTitle')}
        </span>
        <Alert
          className='text-start'
          description={tCheckout('currencyAlert')}
          variant='bordered'
        />
        <div className='text-default-500 text-left text-sm break-words'>
          {formatFullAddress(address)}{' '}
          <button
            className='text-primary hover:text-primary-600 inline-block font-medium underline transition-colors'
            onClick={() => {
              return navigation.ADDRESS()
            }}
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
        <div className='bg-primary/5 border-primary/10 flex flex-col gap-2 overflow-hidden rounded-lg border p-3'>
          <div className='flex items-center justify-between gap-2'>
            <span className='truncate text-sm font-medium'>
              {tCheckout('referrerTitle')}:
            </span>
            <Chip
              className='font-bold'
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
        <span className='text-default-600 w-fit text-left text-sm font-semibold'>
          {tCheckout('referrerTitle')}
        </span>
        <Input
          classNames={{
            input: 'text-center text-default-500',
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
        'border-default-100 mx-auto w-full overflow-hidden border p-2.5 sm:w-xl sm:p-5',
        className,
      )}
      radius='sm'
      shadow='none'
      {...props}
    >
      <CardBody className='gap-4 overflow-hidden'>
        {renderDeliverySelector()}

        <Divider className='bg-default-100/50' />

        {deliveryType === DeliveryType.SHIPPING && (
          <>
            {renderAddressSection()}
            <Divider className='bg-default-100/50' />
          </>
        )}

        {renderReferrerSection()}

        <Divider className='bg-default-100/50' />

        <div className='flex flex-col gap-3 overflow-hidden'>
          <span className='w-fit text-left font-semibold'>
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

      <CardFooter className='flex-col gap-3 overflow-hidden'>
        {deliveryType === DeliveryType.SHIPPING &&
          !isLoadingAddress &&
          !address && (
            <Alert
              className='text-start'
              color='warning'
              description={
                <span className='break-words'>
                  {tCheckout.rich('emptyAddressAlert', {
                    button: (chunks) => {
                      return (
                        <button
                          className='cursor-pointer font-bold underline'
                          onClick={() => {
                            return navigation.ADDRESS()
                          }}
                        >
                          {chunks}
                        </button>
                      )
                    },
                  })}
                </span>
              }
              variant='bordered'
            />
          )}

        {deliveryType === DeliveryType.PICKUP &&
          !selectedStoreId &&
          hasStorefronts && (
            <Alert
              className='text-start'
              color='warning'
              description='กรุณาเลือกสาขาที่ต้องการเข้ารับสินค้า'
              variant='bordered'
            />
          )}

        <Button
          className='text-secondary w-full font-bold'
          color='primary'
          isDisabled={!canOrder}
          isLoading={isCreating}
          radius='none'
          size='lg'
          onPress={() => {
            return handleOrder()
          }}
        >
          {tAction('order')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { CartSummaryCard }
