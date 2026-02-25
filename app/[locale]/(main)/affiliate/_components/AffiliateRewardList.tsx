import { Gift, Trophy, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { LucideIcon } from 'lucide-react'

interface RewardItemConfig {
  icon: LucideIcon
  translationKey: string
}

const REWARD_CONFIG: RewardItemConfig[] = [
  { icon: Trophy, translationKey: 'items.0' },
  { icon: Zap, translationKey: 'items.1' },
  { icon: Gift, translationKey: 'items.2' },
]

const AffiliateRewardList = () => {
  const t = useTranslations('affiliate.rewards')

  return (
    <ul className='space-y-5 text-left'>
      {REWARD_CONFIG.map(({ icon: Icon, translationKey }) => (
        <li key={translationKey} className='flex items-center gap-4'>
          <div className='flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-stone-50'>
            <Icon aria-hidden='true' className='text-amber-500' size={20} />
          </div>
          <span className='font-medium text-stone-400'>
            {t(translationKey)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export { AffiliateRewardList }
