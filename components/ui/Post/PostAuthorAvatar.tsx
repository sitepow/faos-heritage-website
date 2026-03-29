'use client'

import { Avatar } from '@heroui/react'
import { UserIcon } from 'lucide-react'
import { memo } from 'react'

import { IMAGE_FALLBACK } from '@/constants'

interface Props {
  author?: { name: string | null; image: string | null } | null
  className?: string
  iconSize?: number
}

const PostAuthorAvatar = memo(({ author, className, iconSize = 16 }: Props) => {
  return (
    <Avatar
      isBordered
      className={className}
      icon={<UserIcon size={iconSize} />}
      name={author?.name!}
      src={author?.image ?? IMAGE_FALLBACK.EMPTY}
    />
  )
})

export { PostAuthorAvatar }
