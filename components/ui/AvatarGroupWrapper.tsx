import { Avatar, AvatarGroup } from '@heroui/react'

import type { AvatarGroupProps } from '@heroui/react'

interface props extends Partial<AvatarGroupProps> {
  images: string[]
}

const AvatarGroupWrapper = ({ images, max = 3, ...props }: props) => {
  const imageMaxMore = images?.length - max

  return (
    <AvatarGroup
      max={max}
      {...props}
      renderCount={() => {
        return (
          <div className='rounded-small bg-default-200 text-small text-default-600 flex size-14 items-center justify-center font-medium'>
            +{imageMaxMore}
          </div>
        )
      }}
      size='lg'
    >
      {images.map((src, idx) => (
        <Avatar key={idx} radius='sm' src={src} />
      ))}
    </AvatarGroup>
  )
}

export { AvatarGroupWrapper }
