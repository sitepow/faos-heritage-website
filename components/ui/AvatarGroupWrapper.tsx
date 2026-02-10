import { Avatar, AvatarGroup } from '@heroui/react'

import type { AvatarGroupProps } from '@heroui/react'

interface props extends Partial<AvatarGroupProps> {
  images: string[]
}

const AvatarGroupWrapper = ({ images, max = 3, ...props }: props) => {
  return (
    <AvatarGroup max={max} {...props} size='lg'>
      {images.map((src) => (
        <Avatar
          key={src}
          classNames={{
            base: 'ring-0 border-[1.5px] border-background border-default-100',
          }}
          radius='sm'
          src={src}
        />
      ))}
    </AvatarGroup>
  )
}

export { AvatarGroupWrapper }
