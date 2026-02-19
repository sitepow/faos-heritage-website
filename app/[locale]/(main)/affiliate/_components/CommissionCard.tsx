'use client'

import { useTranslations } from 'next-intl'

import type { CommissionTier } from './affiliate.types'

import { cn } from '@/utils'

const CommissionCard = ({
  salesRange,
  percentage,
  isHighlight,
}: CommissionTier) => {
  const t = useTranslations('affiliate.tiers')

  return (
    <div
      className={cn(
        'relative rounded-[2rem] p-8 transition-all duration-300',
        isHighlight
          ? 'z-10 border-2 border-amber-500 bg-white shadow-[0_20px_50px_oklch(76.9%_0.188_70.08_/_0.2)]'
          : 'border border-white/10 bg-white/5 backdrop-blur-sm',
      )}
    >
      {isHighlight && (
        <span className='absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-[#1a1f14]'>
          {t('targetLabel')}
        </span>
      )}

      <h3
        className={cn(
          'mb-2 font-medium transition-colors',
          isHighlight ? 'text-stone-600' : 'text-stone-400',
        )}
      >
        {salesRange}
      </h3>

      <div className='flex flex-wrap items-baseline gap-2'>
        <span
          className={cn(
            'text-6xl font-black tracking-tight transition-colors',
            isHighlight ? 'text-amber-500' : 'text-amber-400',
          )}
        >
          {percentage}
        </span>
        <span className='text-lg font-semibold text-stone-500'>
          {t('label')}
        </span>
      </div>
    </div>
  )
}

export { CommissionCard }
