'use client'

import {
  Card,
  CardHeader,
  Button,
  CardBody,
  Skeleton,
  Alert,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { deleteAddress, getAddresses } from './action'
import { AddressForm } from './form'
import { useAddressStore } from './store'

import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { CountryFlag } from '@/components/ui/CountryFlagAvatar'
import { getFullAddress } from '@/utils/account'

export const AddressCard = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('Account.Address')
  const { onOpenAddressChange, setState, addressId } = useAddressStore()
  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = {
    ADDRESS_CHECKOUT: ['account', 'address', 'checkout', userId],
    ADDRESS_LIST: ['account', 'addresses', userId],
  }

  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: QUERY_KEY.ADDRESS_LIST,
    queryFn: () => getAddresses(userId!),
    enabled: !!userId,
  })

  const isHasDefaultAddress =
    addresses?.some((address) => address?.isDefault === true) ?? false

  const { mutate: mutateDeteleAddress, isPending: isPendingDeteleAddress } =
    useMutation({
      mutationFn: deleteAddress,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY_KEY.ADDRESS_LIST }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.ADDRESS_CHECKOUT,
          }),
        ])
        onOpenDeleteChange()
        setState({ addressId: null })
      },
    })

  return (
    <>
      <ConfirmModal
        isOpen={isDeleteOpen}
        isPending={isPendingDeteleAddress}
        onConfirm={() => {
          mutateDeteleAddress(addressId)
        }}
        onOpenChange={onOpenDeleteChange}
      />
      <Card
        fullWidth
        className='border-divider border'
        radius='sm'
        shadow='none'
      >
        <CardHeader className='flex-wrap items-center justify-between gap-2'>
          <span>{t('manageTitle')}</span>

          <Button
            color='primary'
            startContent={<PlusIcon />}
            variant='bordered'
            onClick={() => onOpenAddressChange()}
          >
            {t('addButton')}
          </Button>
        </CardHeader>
        <CardBody className='gap-5'>
          <AddressForm />

          {isLoadingAddresses && (
            <Skeleton className='h-40 rounded-lg sm:max-w-1/2' />
          )}

          {!isLoadingAddresses && addresses?.length === 0 && (
            <Alert
              color='warning'
              description={t('noAddressAlert')}
              variant='bordered'
            />
          )}

          {!isLoadingAddresses &&
            addresses?.length !== 0 &&
            !isHasDefaultAddress && (
              <Alert
                color='warning'
                description={t('noDefaultAlert')}
                variant='bordered'
              />
            )}

          <div className='grid gap-2 sm:grid-cols-2'>
            {!isLoadingAddresses &&
              addresses?.map((address) => (
                <div key={address.id} className='flex w-full flex-col'>
                  <div className='border-divider flex items-center justify-between gap-2 rounded-t-lg border p-2.5'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <CountryFlag countryCode={address.countryCode} />
                      <span className='line-clamp-1'>{address?.name}</span>
                      {address?.isDefault && (
                        <Chip color='primary' variant='bordered'>
                          {t('defaultTag')}
                        </Chip>
                      )}
                    </div>

                    <Dropdown placement='bottom-end'>
                      <DropdownTrigger>
                        <Button isIconOnly size='sm' variant='light'>
                          <EllipsisVerticalIcon className='text-default-500 size-5' />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label='Manage address'
                        className='min-w-[180px]'
                      >
                        <DropdownItem
                          key='edit'
                          startContent={<EditIcon className='size-4' />}
                          onClick={() => {
                            setState({ addressId: address?.id })
                            onOpenAddressChange()
                          }}
                        >
                          {t('editAddress')}
                        </DropdownItem>
                        <DropdownItem
                          key='delete'
                          className='text-danger'
                          color='danger'
                          startContent={<TrashIcon className='size-4' />}
                          onClick={() => {
                            setState({ addressId: address?.id })
                            onOpenDeleteChange()
                          }}
                        >
                          {t('removeAddress')}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  <div className='border-divider flex flex-col gap-5 rounded-b-lg border-r border-b border-l p-2.5'>
                    <div className='text-default-500 flex flex-wrap items-center gap-4'>
                      <span>{getFullAddress(address)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </>
  )
}
