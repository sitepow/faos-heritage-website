import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { MapPinIcon, PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { getAddress } from '../../actions/address'
import { useAddressStore } from '../../store/address'
import { AddressForm } from '../form/address'

import { getFullAddress } from '@/utils/helper'

const AddressCard = () => {
  const { onOpenAddressChange, setState } = useAddressStore()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const ADDRESS_QUERY_KEY = ['account', 'address', userId]

  const { data: address, isLoading: isLoadingAddress } = useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: () => getAddress(userId!),
    enabled: !!userId,
  })

  return (
    <Card fullWidth>
      <CardHeader className='items-center justify-between'>
        <span>จัดการที่อยู่ของฉัน</span>

        {!isLoadingAddress && !address && (
          <Button
            startContent={<PlusIcon className='text-default-500' />}
            variant='faded'
            onClick={() => onOpenAddressChange()}
          >
            เพิ่มที่อยู่จัดส่ง
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
            description='คุณยังไม่มีข้อมูลที่อยู่สำหรับจัดส่ง กรุณาเพิ่มที่อยู่ก่อนดำเนินการสั่งซื้อสินค้า'
            variant='bordered'
          />
        )}

        {!isLoadingAddress && address && (
          <div className='flex flex-col sm:max-w-1/2'>
            <div className='rounded-t-lg border border-divider p-2.5'>
              <span>ที่อยู่ที่จัดส่ง</span>
            </div>

            <div className='flex flex-col gap-5 border-r border-b border-l border-divider p-2.5'>
              <div className='flex flex-wrap items-center gap-4'>
                <MapPinIcon className='shrink-0 text-default-500' />
                <span>{getFullAddress(address)}</span>
              </div>

              <Button
                className='w-fit'
                variant='faded'
                onClick={() => {
                  setState({ addressId: address?.id })
                  onOpenAddressChange()
                }}
              >
                แก้ไขที่อยู่
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export { AddressCard }
