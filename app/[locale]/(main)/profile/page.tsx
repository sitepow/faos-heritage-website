import { Suspense } from 'react'

import { ProfileClient } from './profile.client'

import { requireAuth } from '@/utils/auth'

const ProfilePage = async () => {
  await requireAuth()

  return (
    <Suspense>
      <ProfileClient />
    </Suspense>
  )
}

export default ProfilePage
