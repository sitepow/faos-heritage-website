import type { PropsWithChildren } from 'react'

const AppSection = ({ children }: PropsWithChildren) => {
  return <section className='flex flex-col gap-5'>{children}</section>
}

export { AppSection }
