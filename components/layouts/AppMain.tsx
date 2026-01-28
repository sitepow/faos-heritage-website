import type { PropsWithChildren } from 'react'

const AppMain = ({ children }: PropsWithChildren) => {
  return (
    <main className='bg-page mx-auto flex w-full flex-grow flex-col gap-5 overflow-hidden'>
      {children}
    </main>
  )
}

export { AppMain }
