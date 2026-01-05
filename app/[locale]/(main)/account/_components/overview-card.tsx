'use client'

import { Card, CardHeader, CardBody, Skeleton, Button } from '@heroui/react'
import { Role } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { getUser } from '@/app/[locale]/(dashboard)/dashboard/user'

interface OverviewCardProps {
  onclick?: () => void
}

export const OverviewCard = ({ onclick }: OverviewCardProps) => {
  const t = useTranslations('Account')
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
        <span className='font-bold'>{t('tabs.manage')}</span>
      </CardHeader>
      <CardBody>
        {isLoadingUser && <Skeleton className='h-40 rounded-lg sm:max-w-1/2' />}

        {!isLoadingUser && (
          <div className='flex flex-col sm:max-w-1/2'>
            <div className='border-divider bg-default-50 rounded-t-lg border p-2.5'>
              <span className='font-semibold'>{t('personalInfo')}</span>
            </div>

            <div className='border-divider rounded-b-lg border-x border-b p-2.5 *:flex *:gap-3'>
              <div>
                <span className='text-default-500 min-w-[100px]'>
                  {t('fields.name')}
                </span>
                <span>:</span>
                <span className='font-medium'>{user?.name ?? '-'}</span>
              </div>

              <div>
                <span className='text-default-500 min-w-[100px]'>
                  {t('fields.email')}
                </span>
                <span>:</span>
                <span className='font-medium text-wrap break-all'>
                  {user?.email ?? '-'}
                </span>
              </div>

              <div>
                <span className='text-default-500 min-w-[100px]'>
                  {t('fields.role')}
                </span>
                <span>:</span>
                <span className='font-medium'>
                  {user?.role === Role.ADMIN
                    ? t('roles.admin')
                    : t('roles.customer')}
                </span>
              </div>

              <Button
                className='text-secondary mt-5'
                color='primary'
                onPress={onclick}
              >
                {t('tabs.editProfile')}
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
