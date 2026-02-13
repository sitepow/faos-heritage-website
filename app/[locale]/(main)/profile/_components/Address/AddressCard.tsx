'use client'

import { Card, Button, CardBody, useDisclosure } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AddressItem } from './AddressItem'
import { ProfileHeader } from '../ProfileHeader'

import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { useAddressStore } from '@/features/address/address.store'
import { AddressForm } from '@/features/address/ui/AddressForm'
import { useAddresses } from '@/features/address/useAddress'
import { useDeleteAddress } from '@/features/address/useDeleteAddress'
import { useAuth } from '@/hooks/useAuth'

const AddressCard = () => {
  const t = useTranslations('profile')
  const tActions = useTranslations('actions')
  const { onOpenAddressChange, setState } = useAddressStore()

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
      </CardBody>
    </Card>
  )
}

export { AddressCard }
