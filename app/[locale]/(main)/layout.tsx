import type { PropsWithChildren } from 'react'

import { AppMain } from '@/components/layouts/AppMain'
import { Footer } from '@/components/layouts/Footer/Footer'
import { Navbar } from '@/components/layouts/Navbar/Navbar'
import { NavbarTopBar } from '@/components/layouts/Navbar/_components/NavbarTopBar'

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <NavbarTopBar />
      <Navbar />
      <AppMain>{children}</AppMain>
      <Footer />
    </>
  )
}

export default MainLayout
