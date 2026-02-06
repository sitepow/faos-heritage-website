import type { PropsWithChildren } from 'react'

import { AppMain } from '@/components/layouts/AppMain'
import { Footer } from '@/components/layouts/Footer/Footer'
import { Navbar } from '@/components/layouts/Navbar/Navbar'

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <AppMain>{children}</AppMain>
      <Footer />
    </>
  )
}

export default MainLayout
