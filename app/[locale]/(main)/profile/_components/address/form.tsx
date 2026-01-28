'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  Spinner,
  ModalBody,
  Alert,
  Input,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Switch,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createAddress, getAddress, updateAddress } from './action'
import { addressSchema, type AddressInput } from './schema'
import { useAddressStore } from './store'

import { CountryFlag } from '@/components/ui/CountryFlagAvatar'
import { SubHeading } from '@/components/ui/SectionHeader'
import { COUNTRY } from '@/constants/country'

const DEFAULT_VALUES: AddressInput = {
  id: undefined,
  name: '',
  phone: '',
  userId: '',
  address: '',
  district: '',
  subDistrict: '',
  province: '',
  postalCode: '',
  country: '',
  countryCode: '',
  isDefault: true,
}

export const AddressForm = () => {
  const t = useTranslations('Account.AddressForm')
  const ct = useTranslations('Country')

  const { addressId, isAddressOpen, onOpenAddressChange, setState } =
    useAddressStore()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const QUERY_KEY = {
    ADDRESS: ['account', 'address', addressId],
    ADDRESS_CHECKOUT: ['account', 'address', 'checkout', userId],
    ADDRESS_LIST: ['account', 'addresses', userId],
  }

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.ADDRESS,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.ADDRESS_CHECKOUT,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.ADDRESS_LIST,
      }),
    ])
  }

  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: QUERY_KEY.ADDRESS,
    queryFn: () => getAddress(addressId!),
    enabled: !!addressId && isAddressOpen,
  })

  useEffect(() => {
    if (!isAddressOpen) {
      return
    }

    if (!addressId) {
      reset(DEFAULT_VALUES)
      return
    }

    if (address) {
      reset(address)
    }
  }, [isAddressOpen, addressId, address, reset])

  const { mutate: mutateCreateAddress, isPending: isPendingCreateAddress } =
    useMutation({
      mutationFn: createAddress,
      onSuccess: () => {
        onRefetch()
        onClose()
      },
    })

  const { mutate: mutateUpdateAddress, isPending: isPendingUpdateAddress } =
    useMutation({
      mutationFn: updateAddress,
      onSuccess: () => {
        onRefetch()
        onClose()
      },
    })

  const isPending =
    isPendingCreateAddress || isLoadingAddress || isPendingUpdateAddress
  const headerLabel = addressId ? t('editTitle') : t('addTitle')

  const onSubmit = async (data: AddressInput) => {
    const isUpdate = !!addressId

    if (!isUpdate) {
      mutateCreateAddress({ ...data, userId: userId! })
    } else {
      mutateUpdateAddress({ ...data, userId: userId! })
    }
  }

  const onClose = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEY.ADDRESS,
    })
    reset(DEFAULT_VALUES)
    setState({ addressId: null })
    onOpenAddressChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isAddressOpen}
      scrollBehavior='inside'
      size='xl'
      onOpenChange={onOpenAddressChange}
    >
      <ModalContent>
        <ModalHeader>{headerLabel}</ModalHeader>
        {isPending && <Spinner label={t('loading')} />}

        {!isPending && (
          <ModalBody>
            <Alert
              color='warning'
              description={t('alertDescription')}
              variant='bordered'
            />

            <SubHeading title={t('sections.status')} />
            <Controller
              control={control}
              name='isDefault'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  {t('fields.enableAddress')}
                </Switch>
              )}
            />

            <SubHeading title={t('sections.basic')} />
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={
                    errors.name?.message ? t('errors.name') : undefined
                  }
                  isInvalid={!!errors.name}
                  label={t('fields.fullName')}
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='phone'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={
                    errors.phone?.message ? t('errors.phone') : undefined
                  }
                  isInvalid={!!errors.phone}
                  label={t('fields.phone')}
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='address'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={
                    errors.address?.message ? t('errors.address') : undefined
                  }
                  isInvalid={!!errors.address}
                  label={t('fields.street')}
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='subDistrict'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={
                    errors.subDistrict?.message
                      ? t('errors.subDistrict')
                      : undefined
                  }
                  isInvalid={!!errors.subDistrict}
                  label={t('fields.subDistrict')}
                  value={value!}
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='district'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={
                    errors.district?.message ? t('errors.district') : undefined
                  }
                  isInvalid={!!errors.district}
                  label={t('fields.district')}
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='province'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={
                    errors.province?.message ? t('errors.province') : undefined
                  }
                  isInvalid={!!errors.province}
                  label={t('fields.province')}
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='postalCode'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={
                    errors.postalCode?.message
                      ? t('errors.postalCode')
                      : undefined
                  }
                  isInvalid={!!errors.postalCode}
                  label={t('fields.postalCode')}
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='countryCode'
              render={({ field: { value, onChange } }) => (
                <Select
                  errorMessage={
                    errors.countryCode?.message
                      ? t('errors.country')
                      : undefined
                  }
                  isInvalid={!!errors.countryCode}
                  label={t('fields.country')}
                  selectedKeys={value ? [value] : []}
                  variant='bordered'
                  onSelectionChange={(keys) => {
                    const code = Array.from(keys)[0] as string
                    const country = COUNTRY.find((c) => c.code === code)

                    onChange(code)
                    setValue('country', country?.name ?? '', {
                      shouldDirty: true,
                    })
                    setValue('countryCode', code, { shouldDirty: true })
                  }}
                >
                  {COUNTRY.map((country) => (
                    <SelectItem
                      key={country.code}
                      startContent={<CountryFlag countryCode={country.code} />}
                    >
                      {ct(country.code)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </ModalBody>
        )}

        <ModalFooter>
          <Button isDisabled={isPending} variant='faded' onPress={onClose}>
            {t('buttons.cancel')}
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? t('buttons.saving') : t('buttons.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
