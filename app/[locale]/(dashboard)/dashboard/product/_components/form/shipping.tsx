'use client'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Spinner,
  Switch,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Currency } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ShippingCountryInput } from '../../schema/shipping/contry'

import {
  getShippingCountry,
  createShippingCountry,
  updateShippingCountry,
} from '../../action/shipping/contry'
import { shippingCountrySchema } from '../../schema/shipping/contry'
import { useProductStore } from '../../store'

import { CountryFlag } from '@/components/ui/CountryFlagAvatar'
import { SubHeading } from '@/components/ui/SectionHeader'
import { COUNTRY } from '@/constants/country'
import { DEFAULT_CURRENCY } from '@/constants/currency'

const DEFAULT_VALUES: ShippingCountryInput = {
  countryCode: '',
  countryName: '',
  baseRate: 0,
  pricePerKg: 0,
  isActive: true,
  currency: Currency['USD'],
}

export const ShippingForm = () => {
  const {
    isShippingCountryOpen,
    onOpenShippingCountryChange,
    onOpenShippingCountryManagerChange,
    shippingCountryId,
    setState,
  } = useProductStore()
  const queryClient = useQueryClient()

  const QUERY_KEY = {
    SHIPPING_COUNTRY: [
      'dashboard',
      'shipping-country',
      'modal',
      shippingCountryId,
    ],
    SHIPPING_COUNTRIES: ['dashboard', 'shipping-country', 'modal'],
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ShippingCountryInput>({
    resolver: zodResolver(shippingCountrySchema),
    defaultValues: DEFAULT_VALUES,
  })

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.SHIPPING_COUNTRY,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.SHIPPING_COUNTRIES,
      }),
    ])
  }

  const { data: shippingCountry, isLoading: isLoadingShippingCountry } =
    useQuery({
      queryKey: QUERY_KEY.SHIPPING_COUNTRY,
      queryFn: () => getShippingCountry(shippingCountryId!),
      enabled: !!shippingCountryId && isShippingCountryOpen,
    })

  useEffect(() => {
    if (isShippingCountryOpen) {
      if (shippingCountryId && !isLoadingShippingCountry && shippingCountry) {
        reset(shippingCountry)
      } else if (!shippingCountryId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [
    reset,
    isShippingCountryOpen,
    shippingCountryId,
    shippingCountry,
    isLoadingShippingCountry,
  ])

  const {
    mutate: mutateCreateShippingCountry,
    isPending: isPendingCreateShippingCountry,
  } = useMutation({
    mutationFn: createShippingCountry,
    onSuccess: () => {
      onRefetch()
      onClose()
    },
  })

  const {
    mutate: mutateUpdateShippingCountry,
    isPending: isPendingUpdateShippingCountry,
  } = useMutation({
    mutationFn: updateShippingCountry,
    onSuccess: () => {
      onRefetch()
      onClose()
    },
  })

  const isPending =
    isPendingCreateShippingCountry ||
    isLoadingShippingCountry ||
    isPendingUpdateShippingCountry
  const headerLable = shippingCountryId ? 'Edit Shipping' : 'Add Shipping'

  const onSubmit = (data: ShippingCountryInput) => {
    if (!shippingCountryId) {
      mutateCreateShippingCountry(data)
    } else {
      mutateUpdateShippingCountry(data)
    }
  }

  const onClose = () => {
    onRefetch()
    reset(DEFAULT_VALUES)
    setState({ shippingCountryId: null })
    onOpenShippingCountryChange()
    onOpenShippingCountryManagerChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isShippingCountryOpen}
      size='xl'
      scrollBehavior='inside'
      onOpenChange={onOpenShippingCountryChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody>
            <SubHeading title='Status' />
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  Enable shipping
                </Switch>
              )}
            />

            <SubHeading title='Details' />

            <Controller
              control={control}
              name='countryCode'
              render={({ field: { value, onChange } }) => (
                <Select
                  label='Country'
                  selectedKeys={value ? [value] : []}
                  variant='bordered'
                  errorMessage={errors.countryCode?.message}
                  isInvalid={!!errors.countryCode}
                  onSelectionChange={(keys) => {
                    const code = Array.from(keys)[0] as string
                    const country = COUNTRY.find(
                      (country) => country.code === code,
                    )

                    onChange(code)

                    setValue('countryName', country?.name ?? '', {
                      shouldDirty: true,
                    })
                    setValue('countryCode', code, {
                      shouldDirty: true,
                    })
                  }}
                >
                  {COUNTRY.map((country) => (
                    <SelectItem
                      key={country.code}
                      startContent={<CountryFlag countryCode={country.code} />}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <SubHeading title='Shipping rates' />
            <Controller
              control={control}
              name='baseRate'
              render={({ field: { onChange, ...field } }) => (
                <NumberInput
                  {...field}
                  errorMessage={errors.baseRate?.message}
                  isInvalid={!!errors.baseRate}
                  label={`Base rate (${DEFAULT_CURRENCY})`}
                  minValue={0}
                  variant='bordered'
                  onValueChange={(val) => onChange(val || 0)}
                />
              )}
            />

            <Controller
              control={control}
              name='pricePerKg'
              render={({ field: { onChange, ...field } }) => (
                <NumberInput
                  {...field}
                  errorMessage={errors.pricePerKg?.message}
                  isInvalid={!!errors.pricePerKg}
                  label={`Price / kg (${DEFAULT_CURRENCY})`}
                  minValue={0}
                  variant='bordered'
                  onValueChange={(val) => onChange(val || 0)}
                />
              )}
            />
          </ModalBody>
        )}

        <ModalFooter>
          <Button isDisabled={isPending} variant='faded' onPress={onClose}>
            Cancel
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
