/* eslint-disable react/no-unstable-nested-components */
'use client'

import { Card, Button, CardBody, useDisclosure, Alert } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AddressItem } from './AddressItem'
import { ProfileHeader } from '../Profile/ProfileHeader'

import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { useAddressStore } from '@/features/address/address.store'
import { AddressForm } from '@/features/address/ui/AddressForm'
import { useAddresses } from '@/features/address/useAddress'
import { useDeleteAddress } from '@/features/address/useDeleteAddress'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'

const AddressCard = () => {
  const t = useTranslations('profile')
  const tActions = useTranslations('actions')
  const tCheckout = useTranslations('cart.checkout')
  const { onOpenAddressChange, setState } = useAddressStore()

  const navigation = useAppNavigation()

  const { userId } = useAuth()
  const { data: addresses } = useAddresses(userId!)

  const { mutate: deleteAddr, isPending: isDeleting } = useDeleteAddress()
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmChange,
  } = useDisclosure()
  const [targetId, setTargetId] = useState<string | null>(null)

  const handleOpenForm = (id: string | null = null) => {
    setState({ addressId: id })
    onOpenAddressChange()
  }

  const handleDeleteClick = (id: string) => {
    setTargetId(id)
    onConfirmOpen()
  }

  const handleConfirmDelete = () => {
    if (targetId) {
      deleteAddr(targetId, {
        onSuccess: () => {
          onConfirmChange()
          setTargetId(null)
        },
      })
    }
  }

  return (
    <Card
      fullWidth
      className='border-default-100 border'
      radius='sm'
      shadow='none'
    >
      <ProfileHeader>
        <b>{t('sections.address')}</b>
        <Button
          color='primary'
          startContent={<PlusIcon />}
          variant='bordered'
          onPress={() => handleOpenForm()}
        >
          {tActions('new')}
        </Button>
      </ProfileHeader>

      <CardBody className='gap-5'>
        <AddressForm />

        <ConfirmDeleteModal
          isOpen={isConfirmOpen}
          isPending={isDeleting}
          onConfirm={handleConfirmDelete}
          onOpenChange={onConfirmChange}
        />

        {addresses?.length === 0 && (
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

        {addresses?.length !== 0 && (
          <div className='grid gap-3 sm:grid-cols-2'>
            {addresses?.map((address) => (
              <AddressItem
                key={address.id}
                address={address}
                onDelete={() => handleDeleteClick(address.id)}
                onEdit={() => handleOpenForm(address.id)}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export { AddressCard }
