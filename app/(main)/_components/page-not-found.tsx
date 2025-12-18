import { AlertCircleIcon } from 'lucide-react'

import type { FC, PropsWithChildren } from 'react'

const PageNotFound: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-2 text-center text-default-500'>
      <AlertCircleIcon className='size-6' />
      <span className='text-center sm:max-w-2/3 md:max-w-1/3'>{children}</span>
    </div>
  )
}

export { PageNotFound }
