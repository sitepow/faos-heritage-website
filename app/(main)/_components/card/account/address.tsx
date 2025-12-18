import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { EditIcon, PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { AddressForm } from '@/app/(main)/_components/form/address'
import { getAddress } from '@/app/(main)/actions/address'
import { useAddressStore } from '@/app/(main)/store/address'
import { getFullAddress } from '@/utils/helper'

const AddressCard = () => {
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
            <div className='rounded-t-lg border border-divider p-2.5'>
              <span>Delivery address</span>
            </div>

            <div className='flex flex-col gap-5 border-r border-b border-l border-divider p-2.5'>
              <div className='flex flex-wrap items-center gap-4'>
                <span>{getFullAddress(address)}</span>
              </div>

              <Button
                className='w-fit text-white'
                color='primary'
                startContent={<EditIcon />}
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

export { AddressCard }
