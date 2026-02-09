'use client'

import { useTranslations } from 'next-intl'

import { ProfileLabel } from './_components/ProfileLabel'
import { ProfileTabs } from './_components/ProfileTabs'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { useAuth } from '@/hooks/useAuth'

const ProfileClient = () => {
  const t = useTranslations('profile')
  const { user } = useAuth()

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
