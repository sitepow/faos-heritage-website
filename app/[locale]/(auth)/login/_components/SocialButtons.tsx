/* eslint-disable @next/next/no-img-element */
import { Card, CardBody } from '@heroui/react'
import { signIn } from 'next-auth/react'

interface SocialButtonsProps {
  dividerText: string
  callbackUrl?: string
}

const SocialButtons = ({
  dividerText,
  callbackUrl = '/',
}: SocialButtonsProps) => {
  const providers = [
    { id: 'google', name: 'Google', icon: '/images/social/google.png' },
    // { id: 'facebook', name: 'Facebook', icon: '/images/social/facebook.png' },
  ]

  return (
    <div className='mt-6 flex flex-col gap-4'>
      <div className='relative flex w-full items-center'>
        <div className='border-divider flex-grow border-t' />
        <span className='px-4 text-xs whitespace-nowrap text-gray-500 uppercase'>
          {dividerText}
        </span>
        <div className='border-divider flex-grow border-t' />
      </div>

      <div className='grid w-full gap-2'>
        {providers.map((p) => (
          <Card
            key={p.id}
            isPressable
            className='border-default-100 border'
            shadow='none'
            onClick={() => signIn(p.id, { callbackUrl })}
          >
            <CardBody className='flex-row items-center justify-center gap-2 p-2'>
              <img
                alt={p.name}
                className='shrink-0 rounded-full'
                height={24}
                src={p.icon}
                width={24}
              />
              <span className='text-sm font-medium'>{p.name}</span>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}

export { SocialButtons }
