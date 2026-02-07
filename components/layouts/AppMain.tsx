import type { PropsWithChildren } from 'react'

const AppMain = ({ children }: PropsWithChildren) => {
  return (
    <main className='mx-auto flex w-full flex-grow flex-col gap-5 overflow-hidden'>
      {children}
    </main>
  )
}

export { AppMain }
