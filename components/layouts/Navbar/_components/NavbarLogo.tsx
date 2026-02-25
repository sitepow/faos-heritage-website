'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

const NavbarLogo = () => {
  return (
    <Link className='flex shrink-0 items-center justify-center' href='/'>
      <img
        alt='FAOS Heritage Food'
        className='h-12 w-auto cursor-pointer transition-opacity hover:opacity-80 md:h-16'
        src='/images/logo.png'
      />
    </Link>
  )
}

export { NavbarLogo }
