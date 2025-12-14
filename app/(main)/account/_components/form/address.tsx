import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'
import { Spinner } from '@heroui/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { AddressInput } from '../../schema/address'

import { createAddress, getAddress, updateAddress } from '../../actions/address'
import { addressSchema } from '../../schema/address'
import { useAddressStore } from '../../store/address'

const DEFAULT_VALUES: AddressInput = {
  name: '',
  phone: '',
  userId: '',
  address: '',
  district: '',
  subDistrict: '',
  province: '',
  postalCode: '',
  country: '',
}

const AddressForm = () => {
  const { addressId, isAddressOpen, onOpenAddressChange, setState } =
    useAddressStore()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const ADDRESS_QUERY_KEY = ['account', 'address', userId]

  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: () => getAddress(addressId!),
    enabled: !!addressId && isAddressOpen,
  })

  useEffect(() => {
    if (isAddressOpen) {
      if (addressId && !isLoadingAddress && address) {
        reset(address)
      } else if (!addressId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isLoadingAddress, addressId, address, isLoadingAddress, reset])

  const { mutate: mutateCreateAddress, isPending: isPendingCreateAddress } =
    useMutation({
      mutationFn: createAddress,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ADDRESS_QUERY_KEY,
        })
        onClose()
      },
    })

  const { mutate: mutateUpdateAddress, isPending: isPendingUpdateAddress } =
    useMutation({
      mutationFn: updateAddress,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ADDRESS_QUERY_KEY,
        })
        onClose()
      },
    })

  const isPending =
    isPendingCreateAddress || isLoadingAddress || isPendingUpdateAddress
  const headerLable = addressId
    ? 'Edit the shipping address.'
    : 'Add a shipping address.'

  const onSubmit = async (data: AddressInput) => {
    const isUpdate = !!addressId

    if (!isUpdate) {
      mutateCreateAddress({ ...data, userId: userId! })
    } else {
      mutateUpdateAddress({ ...data, userId: userId! })
    }
  }

  const onClose = async () => {
    queryClient.removeQueries({
      queryKey: ADDRESS_QUERY_KEY,
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
      onOpenChange={onOpenAddressChange}
    >
      <ModalContent>
        <ModalHeader>{headerLable}</ModalHeader>
        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody>
            <Alert
              description='Please ensure your address is correct to avoid potential delivery issues.'
              variant='bordered'
            />

            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label='Shipping name'
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
                  label='telephone number'
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
                  label='Address (house number / street / village)'
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
                  label='Subdistrict/District'
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
                  label='District/Area'
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
                  label='province'
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
                  label='zip code'
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='country'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.country?.message}
                  isInvalid={!!errors.country}
                  label='country'
                  variant='bordered'
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
            isDisabled={isPending || !isDirty}
            variant='faded'
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'In progress' : 'Record data'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { AddressForm }
