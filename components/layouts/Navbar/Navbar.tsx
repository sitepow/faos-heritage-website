'use client'

import { Container } from '../Container'
import { NavbarActions } from './_components/NavbarActions'
import { NavbarLogo } from './_components/NavbarLogo'
import { NavbarMenu } from './_components/NavbarMenu'
import { NavbarSearch } from './_components/NavbarSearch'

const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 w-full bg-[#ffffffe4] backdrop-blur-md dark:bg-[#0a0a0ae4]'>
      <div className='border-default-100 border-b lg:pb-5'>
        <Container className='flex items-center justify-between gap-4 p-5'>
          <NavbarSearch />
          <NavbarLogo />
          <NavbarActions />
        </Container>

        <NavbarMenu />
      </div>
    </nav>
  )
}

export { Navbar }
