/* eslint-disable react/no-unstable-nested-components */
'use client'

import { Avatar, AvatarGroup } from '@heroui/react'
import { UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { cn } from '@/utils'

const AffiliatePartnerAvatars = ({ className }: ComponentProps<'div'>) => {
  const t = useTranslations('affiliate.banner')

  const renderAvatars = () => {
    return Array.from({ length: 4 }).map((_, i) => (
      <Avatar
        key={i}
        showFallback
        className='bg-stone-800 text-stone-400'
        icon={<UserIcon size={16} />}
      />
    ))
  }

  return (
    <div
      aria-label='Partner social proof'
      className={cn(
        'flex flex-col items-center gap-3 text-center md:flex-row',
        className,
      )}
    >
      <AvatarGroup
        isBordered
        aria-hidden='true'
        className='gap-0'
        max={3}
        size='sm'
      >
        {renderAvatars()}
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
