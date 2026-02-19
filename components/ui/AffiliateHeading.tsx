/* eslint-disable react/no-unstable-nested-components */
'use client'

import { useTranslations } from 'next-intl'

import type { LucideIcon } from 'lucide-react'

import { cn } from '@/utils'

interface Props {
  namespace?: string
  align?: 'left' | 'center'
  descriptionAlign?: 'left' | 'center' | 'right'
  isHero?: boolean
  className?: string
  icon?: LucideIcon
}

const AffiliateHeading = ({
  namespace = 'affiliate.banner',
  align = 'left',
  descriptionAlign,
  isHero = false,
  className,
  icon: Icon,
}: Props) => {
  const t = useTranslations(namespace)
  const isCenter = align === 'center'
  const hasTagline = t.has('tagline')

  const dAlign = descriptionAlign || align

  return (
    <div
      className={cn(
        'flex flex-col',
        isHero ? 'gap-6' : 'gap-4',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {hasTagline && (
        <span className='text-faos-amber text-sm font-semibold tracking-wider uppercase'>
          {t('tagline')}
        </span>
      )}

      <h2
        className={cn(
          'text-3xl font-bold tracking-tight whitespace-pre-line text-white sm:w-full',
          isHero
            ? '!leading-[1.25] md:text-7xl'
            : '!leading-tight lg:text-4xl xl:text-5xl',
        )}
      >
        {t.rich('title', {
          br: () => <span aria-hidden='true' className='block h-0' />,
          highlight: (chunks) => (
            <span className='text-amber-400'>{chunks}</span>
          ),
          icon: () =>
            Icon ? (
              <Icon
                className={cn(
                  'ml-2 inline-block shrink-0 align-middle',
                  isHero
                    ? 'size-[0.8em]'
                    : 'hidden size-[0.8em] sm:inline-block',
                )}
              />
            ) : null,
        })}
      </h2>

      <p
        className={cn(
          'text-lg leading-relaxed text-stone-400',
          isHero ? 'max-w-2xl md:text-xl' : 'max-w-md',
          dAlign === 'center' ? 'mx-auto text-center' : 'text-left',
          dAlign === 'right' && 'ml-auto text-right',
        )}
      >
        {t.rich('description', {
          br: () => <span aria-hidden='true' className='block h-0' />,
          highlight: (chunks) => (
            <span className='font-medium text-white'>{chunks}</span>
          ),
        })}
      </p>
    </div>
  )
}

export { AffiliateHeading }
