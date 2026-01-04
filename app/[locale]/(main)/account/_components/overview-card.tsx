'use client'

import { Card, CardHeader, CardBody, Skeleton, Button } from '@heroui/react'
import { Role } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import { getUser } from '@/app/[locale]/(dashboard)/dashboard/user'

interface OverviewCardProps {
  onclick?: () => void
}

export const OverviewCard = ({ onclick }: OverviewCardProps) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = {
    ACCOUNT: ['account', 'user', userId],
  }

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: QUERY_KEY.ACCOUNT,
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
            <div className='border-divider rounded-t-lg border p-2.5'>
              <span>personal information</span>
            </div>

            <div className='border-divider rounded-b-lg border-x border-b p-2.5 *:flex *:gap-3'>
              <div>
                <span>Name - Surname</span>
                <span>:</span>
                <span>{user?.name ?? '-'}</span>
              </div>

              <div>
                <span>Email</span>
                <span>:</span>
                <span>{user?.email ?? '-'}</span>
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

              <Button
                className='text-secondary mt-5'
                color='primary'
                onPress={onclick}
              >
                Edit personal information
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
