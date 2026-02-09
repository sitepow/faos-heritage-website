'use client'

import { Button, CardBody } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { InfoItem } from './InfoItem'

import { BorderedCard } from '@/components/ui/BorderedCard'
import { useUser } from '@/features/user/useUser'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'
import { useRoleLabel } from '@/hooks/useRoleLabel'

const AccountCard = () => {
  const t = useTranslations('profile')
  const tField = useTranslations('fields')

  const { userId } = useAuth()
  const { getRoleLabel } = useRoleLabel()
  const { data: user, isLoading, isError } = useUser(userId!)
  const navigation = useAppNavigation()

  if (!userId || isError) {
    return null
  }

  return (
    <BorderedCard>
      <CardBody>
        <div className='flex flex-col sm:max-w-1/2'>
          <div className='border-default-100 bg-primary rounded-t-lg border p-2.5 text-white'>
            <span className='font-semibold'>{t('sections.personal')}</span>
          </div>

          <div className='border-default-100 flex flex-col gap-3 rounded-b-lg border-x border-b p-2.5'>
            <InfoItem label={tField('fullName')} value={user?.name} />
            <InfoItem label={tField('email')} value={user?.email} />
            <InfoItem
              label={tField('role')}
              value={getRoleLabel(user?.role!)}
            />

            <div className='mt-5 flex flex-wrap gap-2'>
              <Button
                color='primary'
                isDisabled={isLoading}
                variant='bordered'
                onPress={navigation.PROFILE}
              >
                {t('tabs.edit')}
              </Button>
              <Button
                color='primary'
                isDisabled={isLoading}
                variant='bordered'
                onPress={navigation.ADDRESS}
              >
                {t('sections.address')}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </BorderedCard>
  )
}

export { AccountCard }
