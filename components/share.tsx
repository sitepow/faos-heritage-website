import { SocialIcon } from 'react-social-icons'

import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

const Share: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 *:cursor-pointer', className)} {...props}>
      <span>แชร์ : </span>
      <SocialIcon network='facebook' style={{ width: 35, height: 35 }} />
      <SocialIcon network='telegram' style={{ width: 35, height: 35 }} />
      <SocialIcon network='line.me' style={{ width: 35, height: 35 }} />
      <SocialIcon network='x' style={{ width: 35, height: 35 }} />
      <SocialIcon network='discord' style={{ width: 35, height: 35 }} />
      <SocialIcon network='sharethis' style={{ width: 35, height: 35 }} />
      <SocialIcon network='threads' style={{ width: 35, height: 35 }} />
    </div>
  )
}

export { Share }
