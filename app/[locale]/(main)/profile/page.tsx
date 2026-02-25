import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

import type { Metadata } from 'next'

import { ProfileClient } from './profile.client'

import { constructMetadata } from '@/lib/metadata'
import { requireAuth } from '@/utils/auth'

interface Props {
  params: Promise<{ locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return constructMetadata({
    title: t('profile.title'),
    noIndex: true,
  })
}

const ProfilePage = async () => {
  await requireAuth()

  return (
    <Suspense>
      <ProfileClient />
    </Suspense>
  )
}

export { generateMetadata }
export default ProfilePage
