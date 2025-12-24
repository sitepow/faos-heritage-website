import { AlertCircleIcon } from 'lucide-react'

import type { PropsWithChildren } from 'react'

export const PageNotFound = ({ children }: PropsWithChildren) => {
  return (
    <div className='text-default-500 flex flex-col items-center justify-center gap-2 text-center'>
      <AlertCircleIcon className='size-6' />
      <span className='text-center sm:max-w-2/3 md:max-w-1/3'>{children}</span>
    </div>
  )
}
