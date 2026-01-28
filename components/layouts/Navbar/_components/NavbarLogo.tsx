/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation'

const NavbarLogo = () => {
  const router = useRouter()

  return (
    <div className='flex shrink-0 items-center justify-center'>
      <img
        alt='Logo'
        className='h-12 w-auto cursor-pointer transition-opacity hover:opacity-80 md:h-16'
        src='/images/logo.png'
        onClick={() => router.push('/')}
      />
    </div>
  )
}

export { NavbarLogo }
