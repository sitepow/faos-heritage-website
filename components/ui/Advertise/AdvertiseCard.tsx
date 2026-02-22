import { CheckCircleIcon } from 'lucide-react'

import { SectionHeader } from '../SectionHeader'

import { getBackgroundStyle } from '@/utils'

interface Props {
  title: string
  image: string
  messages: string[]
}

const AdvertiseCard = ({ title, image, messages }: Props) => {
  return (
    <div
      className='relative overflow-hidden px-6 py-16 text-white'
      style={getBackgroundStyle(image)}
    >
      <div className='relative z-10 flex flex-col items-center gap-10'>
        <SectionHeader className='max-w-2xl text-white' title={title} />

        <ul className='grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {messages.map((message) => (
            <li
              key={message}
              className='flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md'
            >
              <CheckCircleIcon className='size-6 shrink-0' />
              <span className='text-sm leading-snug font-medium sm:text-base'>
                {message}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { AdvertiseCard }
