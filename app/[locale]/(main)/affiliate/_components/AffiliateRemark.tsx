'use client'

import { InfoIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  title?: string
  items: string[]
}

const AffiliateRemark = ({ title, items = [] }: Props) => {
  const t = useTranslations('affiliate.remarks')
  const displayTitle = title || t('defaultTitle')

  return (
    <div className='mx-auto flex w-full max-w-3xl items-start gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-5 text-stone-500 backdrop-blur-sm'>
      <div className='text-lg leading-relaxed tracking-tight sm:text-xl'>
        <div className='flex flex-wrap gap-2'>
          <InfoIcon className='mt-1 size-5 flex-shrink-0 text-stone-400' />
          <p className='font-semibold text-stone-300'>{displayTitle}</p>
        </div>

        {items.length > 0 && (
          <ul className='mt-1 list-inside list-disc space-y-1'>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export { AffiliateRemark }
