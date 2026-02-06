'use client'

import { NavbarActions } from './_components/NavbarActions'
import { NavbarLogo } from './_components/NavbarLogo'
import { NavbarMenu } from './_components/NavbarMenu'
import { NavbarSearch } from './_components/NavbarSearch'
import { NavbarTopBar } from './_components/NavbarTopBar'

const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 w-full bg-white dark:bg-[#0a0a0a]'>
      <NavbarTopBar />

      <div className='border-default-100/60 border-b pb-5'>
        <div className='container mx-auto flex items-center justify-between gap-4 px-6 py-4'>
          <NavbarSearch />
          <NavbarLogo />
          <NavbarActions />
        </div>

        <NavbarMenu />
      </div>
    </nav>
  )
}

export { Navbar }
