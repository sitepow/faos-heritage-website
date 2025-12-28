'use client'

import {
  Card,
  CardHeader,
  Button,
  CardBody,
  Skeleton,
  Alert,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { AddressForm } from './form'
import { useAddressStore } from './store'
import { getAddress } from '../../action'

import { getFullAddress } from '@/utils/features'

export const AddressCard = () => {
  const { onOpenAddressChange, setState } = useAddressStore()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
    ADDRESS: ['account', 'address', userId],
  }

  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: QUERY.ADDRESS,
    queryFn: () => getAddress(userId!),
    enabled: !!userId,
  })

  return (
    <Card fullWidth>
      <CardHeader className='flex-wrap items-center justify-between gap-2'>
        <span>Manage my address</span>

        {!isLoadingAddress && !address && (
          <Button
            startContent={<PlusIcon />}
            variant='faded'
            onClick={() => onOpenAddressChange()}
          >
            Add shipping address
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <AddressForm />

        {isLoadingAddress && (
          <Skeleton className='h-40 rounded-lg sm:max-w-1/2' />
        )}

        {!isLoadingAddress && !address && (
          <Alert
            description='You do not yet have a shipping address. Please add your address before proceeding with your order.'
            variant='bordered'
          />
        )}

        {!isLoadingAddress && address && (
          <div className='flex flex-col sm:max-w-1/2'>
            <div className='border-divider rounded-t-lg border p-2.5'>
              <span>Delivery address</span>
            </div>

            <div className='border-divider flex flex-col gap-5 border-r border-b border-l p-2.5'>
              <div className='flex flex-wrap items-center gap-4'>
                <span>{getFullAddress(address)}</span>
              </div>

              <Button
                className='text-secondary w-fit'
                color='primary'
                onClick={() => {
                  setState({ addressId: address?.id })
                  onOpenAddressChange()
                }}
              >
                Edit address
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
