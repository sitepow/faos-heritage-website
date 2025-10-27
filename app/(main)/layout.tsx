import type { FC, PropsWithChildren } from 'react'

import { Navbar } from '@/components/layout/navbar'
import { siteConfig } from '@/config/site'

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden'>
      <Navbar />
      <main className='container mx-auto flex-grow p-6'>{children}</main>
      <footer className='flex w-full items-center justify-center py-3'>
        <span className='text-default-600'>{siteConfig.footer}</span>
      </footer>
    </div>
  )
}

export default MainLayout
