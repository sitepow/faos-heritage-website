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
  const getInitials = () => {
    if (!author?.name) {
      return 'AU'
    }

    const nameParts = author.name.trim().split(' ')
    if (nameParts.length > 1) {
      const firstName = nameParts[0].charAt(0)
      const lastName = nameParts[nameParts.length - 1].charAt(0)
      return `${firstName}${lastName}`.toUpperCase()
    }

    return nameParts[0].charAt(0).toUpperCase()
  }

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`

  return (
    <Avatar
      className={className}
      icon={<UserIcon size={iconSize} />}
      name={author?.name ?? 'Author'}
      src={avatarUrl || IMAGE_FALLBACK.EMPTY}
    />
  )
})

export { PostAuthorAvatar }
