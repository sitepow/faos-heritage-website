'use client'

import { useTranslations } from 'next-intl'

import { ProfileLabel } from './_components/Profile/ProfileLabel'
import { ProfileTabs } from './_components/Profile/ProfileTabs'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { useUser } from '@/features/user/useUser'
import { useAuth } from '@/hooks/useAuth'

const ProfileClient = () => {
  const t = useTranslations('profile')
  const { userId } = useAuth()
  const { data: user } = useUser(userId!)

  return (
    <Container>
      <AppSection>
        <ProfileLabel label={t('welcome', { name: user?.name! })} />
        <ProfileTabs />
      </AppSection>
    </Container>
  )
}

export { ProfileClient }
