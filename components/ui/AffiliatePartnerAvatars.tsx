/* eslint-disable react/no-unstable-nested-components */

'use client'

import { Avatar, AvatarGroup } from '@heroui/react'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { cn } from '@/utils'

const AffiliatePartnerAvatars = ({ className }: ComponentProps<'div'>) => {
  const t = useTranslations('affiliate.banner')

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 text-center md:flex-row',
        className,
      )}
    >
      <AvatarGroup isBordered max={3} size='sm'>
        <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026024d' />
        <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026704d' />
        <Avatar src='https://i.pravatar.cc/150?u=a04258114e29026702d' />
        <Avatar src='https://i.pravatar.cc/150?u=a04258114e29026702d' />
      </AvatarGroup>
      <p className='text-sm text-stone-400'>
        {t.rich('partnerStatus', {
          highlight: (chunks) => (
            <span className='font-semibold text-white'>{chunks}</span>
          ),
        })}
      </p>
    </div>
  )
}

export { AffiliatePartnerAvatars }
