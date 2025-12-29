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
  Avatar,
  Switch,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createAddress, getAddress, updateAddress } from './action'
import { addressSchema, type AddressInput } from './schema'
import { useAddressStore } from './store'

import { SubHeading } from '@/components'
import { COUNTRIES } from '@/utils/constants/countries'

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
    SHIPPING_COST: ['shipping', 'carts', userId],
  }

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.SHIPPING_COST,
      }),
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
  const headerLable = addressId
    ? 'Edit Shipping Address'
    : 'Add Shipping Address'

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
        <ModalHeader>{headerLable}</ModalHeader>
        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody>
            <Alert
              color='warning'
              description='Please ensure your address is correct to avoid potential delivery issues.'
              variant='bordered'
            />

            <SubHeading title='Address status' />
            <Controller
              control={control}
              name='isDefault'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  Enable this address
                </Switch>
              )}
            />

            <SubHeading title='Basic information' />
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label='Full Name'
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
                  errorMessage={errors.phone?.message}
                  isInvalid={!!errors.phone}
                  label='Phone Number'
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
                  errorMessage={errors.address?.message}
                  isInvalid={!!errors.address}
                  label='Street Address'
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
                  errorMessage={errors.subDistrict?.message}
                  isInvalid={!!errors.subDistrict}
                  label='Subdistrict'
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
                  errorMessage={errors.district?.message}
                  isInvalid={!!errors.district}
                  label='District'
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
                  errorMessage={errors.province?.message}
                  isInvalid={!!errors.province}
                  label='Province / State'
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
                  errorMessage={errors.postalCode?.message}
                  isInvalid={!!errors.postalCode}
                  label='Postal Code'
                  variant='bordered'
                />
              )}
            />

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
                    const country = COUNTRIES.find((c) => c.code === code)

                    onChange(code)

                    setValue('country', country?.name ?? '', {
                      shouldDirty: true,
                    })
                    setValue('countryCode', code, {
                      shouldDirty: true,
                    })
                  }}
                >
                  {COUNTRIES.map((country) => (
                    <SelectItem
                      key={country.code}
                      startContent={
                        <Avatar
                          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code}.svg`}
                        />
                      }
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </Select>
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
