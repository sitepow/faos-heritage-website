import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import type { Resolver } from 'react-hook-form'

import { createAddress, updateAddress } from './address.action'
import { useAddress } from './address.hook'
import { addressQueryKeys } from './address.query-key'
import { addressSchema, type AddressInput } from './address.schema'
import { useAddressStore } from './address.store'

const DEFAULT_VALUES: AddressInput = {
  name: '',
  phone: '',
  address: '',
  district: '',
  subDistrict: '',
  province: '',
  postalCode: '',
  country: '',
  countryCode: '',
  isDefault: true,
}

const useAddressForm = (userId: string | undefined) => {
  const queryClient = useQueryClient()
  const { addressId, isAddressOpen, onOpenAddressChange, setState } =
    useAddressStore()

  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema) as Resolver<AddressInput>,
    defaultValues: DEFAULT_VALUES,
  })

  const { data: address, isLoading } = useAddress(
    isAddressOpen ? addressId : null,
  )

  useEffect(() => {
    if (!isAddressOpen) return

    if (addressId && address) {
      form.reset({
        id: address.id,
        userId: address.userId,
        name: address.name || '',
        phone: address.phone || '',
        address: address.address || '',
        district: address.district || '',
        subDistrict: address.subDistrict || '',
        province: address.province || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        countryCode: address.countryCode || '',
        isDefault: address.isDefault ?? false,
      })
    } else if (!addressId) {
      form.reset(DEFAULT_VALUES)
    }
  }, [isAddressOpen, addressId, address, form])

  const invalidateData = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: addressQueryKeys.all })
  }, [queryClient])

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_VALUES)
    setState({ addressId: null })
    if (isAddressOpen) onOpenAddressChange()
    invalidateData()
  }, [form, invalidateData, isAddressOpen, onOpenAddressChange, setState])

  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: handleClose,
  })

  const updateMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: handleClose,
  })

  const onSubmit = async (data: AddressInput) => {
    const payload = { ...data, userId: userId! }
    if (addressId) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    onClose: handleClose,
    isPending:
      isLoading || createMutation.isPending || updateMutation.isPending,
    isAddressOpen,
    addressId,
    errors: {
      name: form.formState.errors.name?.message?.toString(),
      phone: form.formState.errors.phone?.message?.toString(),
      address: form.formState.errors.address?.message?.toString(),
      district: form.formState.errors.district?.message?.toString(),
      province: form.formState.errors.province?.message?.toString(),
      postalCode: form.formState.errors.postalCode?.message?.toString(),
      country: form.formState.errors.country?.message?.toString(),
    },
  }
}

export { useAddressForm }
