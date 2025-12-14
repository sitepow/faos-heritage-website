import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { Role } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import type { FC } from 'react'

import { getUser } from '@/app/(dashboard)/dashboard/user/actions/user'

interface Props {
  onclick?: () => void
}

const AccountCard: FC<Props> = ({ onclick }) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
    ACCOUNT: ['account', 'user', userId],
  }

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: QUERY.ACCOUNT,
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  })

  return (
    <Card fullWidth>
      <CardHeader>
        <span>Manage my account</span>
      </CardHeader>
      <CardBody>
        {isLoadingUser && <Skeleton className='h-40 rounded-lg sm:max-w-1/2' />}

        {!isLoadingUser && (
          <div className='flex flex-col sm:max-w-1/2'>
            <div className='rounded-t-lg border border-divider p-2.5'>
              <span>personal information</span>
            </div>

            <div className='rounded-b-lg border-x border-b border-divider p-2.5 *:flex *:gap-3'>
              <div>
                <span>Name - Surname</span>
                <span>:</span>
                <span>{user?.name}</span>
              </div>

              <div>
                <span>Email</span>
                <span>:</span>
                <span>{user?.email}</span>
              </div>

              <div>
                <span>License</span>
                <span>:</span>
                <span>
                  {user?.role === Role.ADMIN
                    ? 'System administrator'
                    : 'Customer'}
                </span>
              </div>

              <Button className='mt-5' variant='faded' onPress={onclick}>
                Edit personal information
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export { AccountCard }
