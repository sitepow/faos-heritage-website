'use client'

import { Card, CardBody } from '@heroui/react'
import { useLocale, useTranslations } from 'next-intl'

import { FavoriteItem } from './FavoriteItem'
import { ProfileHeader } from '../Profile/ProfileHeader'

import { EmptyState } from '@/components/ui/EmptyState'
import { useFavorites } from '@/features/favorite/hook'

const FavoriteCard = () => {
  const t = useTranslations('profile')
  const tStatus = useTranslations('status')
  const locale = useLocale()

  const { favorites, isLoading, isEmpty } = useFavorites({
    locale,
    limit: 10,
  })

  return (
    <Card
      fullWidth
      className='border-default-100 border'
      radius='sm'
      shadow='none'
    >
      <ProfileHeader>
        <b>{t('tabs.favs')}</b>
      </ProfileHeader>

      <CardBody className='gap-4'>
        {isEmpty && <EmptyState description={tStatus('noData')} />}

        {!isLoading &&
          !isEmpty &&
          favorites.map((favorite) => (
            <FavoriteItem key={favorite.id} favorite={favorite} />
          ))}
      </CardBody>
    </Card>
  )
}

export { FavoriteCard }
