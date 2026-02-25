import type { PropsWithChildren } from 'react'

import { AffiliateTracker } from '@/components/AffiliateTracker'
import { AppMain } from '@/components/layouts/AppMain'
import { Footer } from '@/components/layouts/Footer/Footer'
import { Navbar } from '@/components/layouts/Navbar/Navbar'
import { NavbarTopBar } from '@/components/layouts/Navbar/_components/NavbarTopBar'

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <AffiliateTracker />
      <header className='sticky top-0 z-50 w-full'>
        <NavbarTopBar />
        <Navbar />
      </header>

      <AppMain>{children}</AppMain>

      <Footer />
    </>
  )
}

export default MainLayout
