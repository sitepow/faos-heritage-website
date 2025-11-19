import type { FC, PropsWithChildren } from 'react'

import { MainNavbar } from '@/components/navbar'
import { getFooter } from '@/utils/helper'

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden light:bg-[#f1f1f1]'>
      <MainNavbar />
      <main className='container mx-auto flex-grow p-6'>{children}</main>
      <footer className='flex w-full items-center justify-center py-3'>
        <span className='text-default-600'>{getFooter()}</span>
      </footer>
    </div>
  )
}

export default MainLayout
