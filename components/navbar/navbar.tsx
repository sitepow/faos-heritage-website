// /* eslint-disable @next/next/no-img-element */
// import { Badge, Button, Input } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const t = useTranslations('Navbar')
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='sticky top-0 z-50 flex w-full flex-col bg-[#f1f1f1ec] backdrop-blur-md dark:bg-[#131314ec]'>
//       <NavbarHeader />

//       <div className='border-divider w-full border-b'>
//         <div className='container mx-auto flex items-center justify-between gap-4 px-5 py-2.5 md:gap-8'>
//           <div className='flex gap-5'>
//             <img
//               src='/images/logo.png'
//               alt='Logo'
//               className='size-[55px] shrink-0 cursor-pointer rounded-md object-contain md:size-[75px]'
//               onClick={() => {
//                 router.push('/')
//               }}
//             />
//           </div>

//           <div className='flex items-center gap-3'>
//             <Input
//               size='lg'
//               classNames={{
//                 input: ['!text-primary placeholder:!text-primary'],
//                 inputWrapper: [
//                   '!border-primary',
//                   'group-data-[focus=true]:!border-primary',
//                   'after:hidden',
//                 ],
//               }}
//               className='hidden w-lg lg:block'
//               variant='bordered'
//               placeholder={t('search')}
//               endContent={<SearchIcon className='text-primary' />}
//             />

//             {session && <NavbarPanel />}
//             {!session && (
//               <Button
//                 isIconOnly
//                 variant='light'
//                 onClick={() => {
//                   router.push('/login')
//                 }}
//               >
//                 <LogInIcon />
//               </Button>
//             )}
//             <Badge
//               color='primary'
//               content={'99+'}
//               className='text-secondary'
//               shape='circle'
//             >
//               <Button
//                 isIconOnly
//                 variant='light'
//                 onClick={() => {
//                   router.push('/cart')
//                 }}
//               >
//                 <ShoppingCartIcon />
//               </Button>
//             </Badge>

//             <Button isIconOnly variant='light' className='lg:hidden'>
//               <SearchIcon />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button, Input } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const t = useTranslations('Navbar')
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='sticky top-0 z-50 flex w-full flex-col bg-white/80 backdrop-blur-xl dark:bg-[#0c0c0d]/80'>
//       <NavbarHeader />

//       <div className='border-divider border-b'>
//         <div className='container mx-auto flex items-center justify-between gap-4 px-5 py-3 md:gap-10'>
//           <div className='flex shrink-0 items-center'>
//             <img
//               src='/images/logo.png'
//               alt='Logo'
//               className='h-10 w-auto cursor-pointer transition-transform hover:scale-105 md:h-14'
//               onClick={() => router.push('/')}
//             />
//           </div>

//           <div className='hidden max-w-2xl flex-1 lg:block'>
//             <Input
//               size='md'
//               classNames={{
//                 input: 'text-sm',
//                 inputWrapper: [
//                   'bg-default-100',
//                   'border-transparent',
//                   'group-data-[focus=true]:border-primary',
//                   'group-data-[focus=true]:bg-background',
//                   'transition-all duration-300',
//                 ],
//               }}
//               variant='bordered'
//               placeholder={t('search')}
//               startContent={
//                 <SearchIcon size={18} className='text-default-400' />
//               }
//             />
//           </div>

//           <div className='flex items-center gap-2 md:gap-4'>
//             <Button isIconOnly variant='light' className='lg:hidden'>
//               <SearchIcon size={22} />
//             </Button>

//             {session ? (
//               <NavbarPanel />
//             ) : (
//               <Button
//                 variant='flat'
//                 color='primary'
//                 className='hidden font-bold md:flex'
//                 startContent={<LogInIcon size={18} />}
//                 onClick={() => router.push('/login')}
//               >
//                 {t('login') || 'Login'}
//               </Button>
//             )}

//             {!session && (
//               <Button
//                 isIconOnly
//                 variant='light'
//                 className='md:hidden'
//                 onClick={() => router.push('/login')}
//               >
//                 <LogInIcon size={22} />
//               </Button>
//             )}

//             <Badge
//               color='primary'
//               content={'99+'}
//               className='border-none text-[10px] font-bold text-white'
//               shape='circle'
//               size='sm'
//             >
//               <Button
//                 isIconOnly
//                 variant='light'
//                 className='hover:bg-primary/10'
//                 onClick={() => router.push('/cart')}
//               >
//                 <ShoppingCartIcon size={24} />
//               </Button>
//             </Badge>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button, Input } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const t = useTranslations('Navbar')
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='sticky top-0 z-50 flex w-full flex-col bg-white/70 backdrop-blur-md dark:bg-[#0f0f10]/70'>
//       <NavbarHeader />

//       <div className='w-full'>
//         <div className='container mx-auto flex items-center justify-between gap-4 px-5 py-4'>
//           <div className='flex items-center'>
//             <div
//               className='group relative cursor-pointer'
//               onClick={() => router.push('/')}
//             >
//               <div className='bg-primary/20 absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity group-hover:opacity-100' />
//               <img
//                 src='/images/logo.png'
//                 alt='Logo'
//                 className='relative h-12 w-12 rounded-full object-contain md:h-16 md:w-16'
//               />
//             </div>
//           </div>

//           <div className='hidden max-w-xl flex-1 lg:block'>
//             <Input
//               size='lg'
//               radius='full'
//               classNames={{
//                 input: 'text-sm ml-2',
//                 inputWrapper: [
//                   'bg-white dark:bg-default-100',
//                   'shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
//                   'border-1 border-transparent',
//                   'group-data-[focus=true]:border-primary/20',
//                   'group-data-[focus=true]:shadow-lg',
//                   'transition-all duration-400',
//                 ],
//               }}
//               placeholder={t('search')}
//               startContent={
//                 <div className='bg-primary/10 flex items-center justify-center rounded-full p-2'>
//                   <SearchIcon size={18} className='text-primary' />
//                 </div>
//               }
//             />
//           </div>

//           <div className='dark:bg-default-100/30 border-divider flex items-center gap-3 rounded-full border bg-white/50 p-1.5 backdrop-blur-sm'>
//             <Button
//               isIconOnly
//               variant='light'
//               radius='full'
//               className='lg:hidden'
//             >
//               <SearchIcon size={20} />
//             </Button>

//             {session ? (
//               <NavbarPanel />
//             ) : (
//               <Button
//                 isIconOnly
//                 variant='flat'
//                 color='primary'
//                 radius='full'
//                 onClick={() => router.push('/login')}
//               >
//                 <LogInIcon size={20} />
//               </Button>
//             )}

//             <Badge
//               color='primary'
//               content={'99+'}
//               className='border-2 border-white text-[10px] font-bold text-white'
//               shape='circle'
//             >
//               <Button
//                 isIconOnly
//                 variant='light'
//                 radius='full'
//                 onClick={() => router.push('/cart')}
//               >
//                 <ShoppingCartIcon size={20} />
//               </Button>
//             </Badge>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button, Input } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const t = useTranslations('Navbar')
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='sticky top-0 z-50 flex w-full flex-col'>
//       <NavbarHeader />

//       <div className='relative w-full border-b border-white/20 bg-white/40 backdrop-blur-md dark:border-white/5 dark:bg-[#131314]/60'>
//         <div className='container mx-auto flex items-center justify-between gap-4 px-5 py-3 md:gap-8'>
//           <div className='flex items-center gap-5'>
//             <img
//               src='/images/logo.png'
//               alt='Logo'
//               className='size-[50px] shrink-0 cursor-pointer rounded-xl object-contain shadow-lg transition-all hover:scale-105 active:scale-95 md:size-[65px]'
//               onClick={() => router.push('/')}
//             />
//           </div>

//           <div className='hidden max-w-xl flex-1 lg:block'>
//             <Input
//               size='md'
//               classNames={{
//                 input: ['!text-foreground placeholder:text-default-400'],
//                 inputWrapper: [
//                   'bg-white/20 dark:bg-white/5',
//                   'border border-white/30 dark:border-white/10',
//                   'group-data-[focus=true]:border-primary',
//                   'group-data-[focus=true]:bg-white/40 dark:group-data-[focus=true]:bg-white/10',
//                   'backdrop-blur-sm shadow-sm',
//                   'after:hidden',
//                 ],
//               }}
//               variant='bordered'
//               placeholder={t('search')}
//               endContent={<SearchIcon className='text-primary opacity-70' />}
//             />
//           </div>

//           <div className='flex items-center gap-2 md:gap-3'>
//             <Button
//               isIconOnly
//               variant='flat'
//               className='bg-white/30 lg:hidden dark:bg-white/5'
//               radius='lg'
//             >
//               <SearchIcon size={20} />
//             </Button>

//             {session ? (
//               <NavbarPanel />
//             ) : (
//               <Button
//                 isIconOnly
//                 variant='flat'
//                 className='bg-white/30 hover:bg-white/50 dark:bg-white/5 dark:hover:bg-white/10'
//                 radius='lg'
//                 onClick={() => router.push('/login')}
//               >
//                 <LogInIcon size={22} />
//               </Button>
//             )}

//             <Badge
//               color='primary'
//               content={'99+'}
//               className='border-2 border-white/50 text-white shadow-md'
//               shape='circle'
//               size='sm'
//             >
//               <Button
//                 isIconOnly
//                 variant='flat'
//                 className='bg-primary/10 text-primary hover:bg-primary transition-all duration-300 hover:text-white'
//                 radius='lg'
//                 onClick={() => router.push('/cart')}
//               >
//                 <ShoppingCartIcon size={22} />
//               </Button>
//             </Badge>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button, Input } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const t = useTranslations('Navbar')
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='sticky top-0 z-50 flex w-full flex-col bg-white/80 backdrop-blur-md dark:bg-[#0f0f10]/80'>
//       <NavbarHeader />

//       <div className='border-divider/50 w-full border-b px-4 py-2'>
//         <div className='container mx-auto flex items-center justify-between gap-4'>
//           <div className='flex items-center'>
//             <div
//               className='bg-primary/5 hover:bg-primary/10 flex size-12 cursor-pointer items-center justify-center rounded-[1.5rem] transition-all hover:rounded-[1rem] active:scale-90 md:size-16'
//               onClick={() => router.push('/')}
//             >
//               <img
//                 src='/images/logo.png'
//                 alt='Logo'
//                 className='size-9 object-contain md:size-12'
//               />
//             </div>
//           </div>

//           <div className='hidden max-w-lg flex-1 lg:block'>
//             <Input
//               size='lg'
//               radius='full'
//               classNames={{
//                 input: ['text-sm ml-2'],
//                 inputWrapper: [
//                   'bg-default-100/70',
//                   'border-2 border-transparent',
//                   'group-data-[focus=true]:border-primary/30',
//                   'group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-default-100',
//                   'transition-all duration-300',
//                 ],
//               }}
//               placeholder={t('search')}
//               startContent={
//                 <div className='dark:bg-default-200 ml-1 flex size-8 items-center justify-center rounded-full bg-white shadow-sm'>
//                   <SearchIcon size={16} className='text-primary' />
//                 </div>
//               }
//             />
//           </div>

//           <div className='flex items-center gap-2'>
//             <Button
//               isIconOnly
//               radius='full'
//               variant='light'
//               className='lg:hidden'
//             >
//               <SearchIcon size={20} />
//             </Button>

//             <div className='bg-default-100/50 flex items-center gap-1 rounded-full p-1'>
//               {session ? (
//                 <NavbarPanel />
//               ) : (
//                 <Button
//                   isIconOnly
//                   radius='full'
//                   variant='light'
//                   className='hover:bg-primary/10 dark:bg-default-200 bg-white'
//                   onClick={() => router.push('/login')}
//                 >
//                   <LogInIcon size={20} className='text-primary' />
//                 </Button>
//               )}

//               <Badge
//                 color='primary'
//                 content={'99+'}
//                 className='border-2 border-white text-[10px] font-bold dark:border-[#0f0f10]'
//                 shape='circle'
//                 size='md'
//               >
//                 <Button
//                   isIconOnly
//                   radius='full'
//                   className='bg-primary shadow-primary/20 text-white shadow-lg transition-transform hover:-translate-y-1'
//                   onClick={() => router.push('/cart')}
//                 >
//                   <ShoppingCartIcon size={20} />
//                 </Button>
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button, Input } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const t = useTranslations('Navbar')
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='bg-background sticky top-0 z-50 flex w-full flex-col'>
//       <NavbarHeader />

//       <div className='border-divider w-full border-b py-2.5'>
//         <div className='container mx-auto flex items-center gap-2 px-4'>
//           <div
//             className='bg-content2 hover:bg-content3 flex size-[55px] shrink-0 cursor-pointer items-center justify-center rounded-xl transition-all active:scale-95 md:size-[70px]'
//             onClick={() => router.push('/')}
//           >
//             <img
//               src='/images/logo.png'
//               alt='Logo'
//               className='size-10 object-contain md:size-12'
//             />
//           </div>

//           <div className='bg-content2 focus-within:bg-content3 focus-within:ring-primary/20 flex h-[55px] flex-1 items-center rounded-xl px-4 transition-all focus-within:ring-2 md:h-[70px]'>
//             <SearchIcon size={20} className='text-default-400 shrink-0' />
//             <Input
//               size='sm'
//               variant='flat'
//               classNames={{
//                 input: ['text-sm font-medium bg-transparent'],
//                 inputWrapper: [
//                   'bg-transparent shadow-none data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
//                 ],
//               }}
//               className='w-full'
//               placeholder={t('search')}
//             />
//             <div className='bg-background text-default-400 hidden items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold md:flex'>
//               <span className='opacity-50'>SEARCH</span>
//             </div>
//           </div>

//           <div className='bg-content2 flex h-[55px] items-center gap-2 rounded-xl p-2 md:h-[70px]'>
//             {!session ? (
//               <Button
//                 isIconOnly
//                 variant='flat'
//                 className='bg-background hover:text-primary md:w-12'
//                 onClick={() => router.push('/login')}
//               >
//                 <LogInIcon size={20} />
//               </Button>
//             ) : (
//               <div className='scale-90'>
//                 <NavbarPanel />
//               </div>
//             )}

//             <Badge
//               color='primary'
//               content={'99+'}
//               className='text-[10px] font-black'
//               shape='circle'
//               size='sm'
//             >
//               <Button
//                 isIconOnly
//                 variant='flat'
//                 className='bg-background hover:text-primary md:w-12'
//                 onClick={() => router.push('/cart')}
//               >
//                 <ShoppingCartIcon size={20} />
//               </Button>
//             </Badge>

//             <Button isIconOnly variant='light' className='lg:hidden'>
//               <SearchIcon size={20} />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

/* eslint-disable @next/next/no-img-element */
'use client'

import { Button, Input } from '@heroui/react'
import { LogInIcon, SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { NavbarCart } from './cart'
import { NavbarHeader } from './header'
import { NavbarPanel } from './panel'

export const Navbar = () => {
  const t = useTranslations('Navbar')
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <nav className='sticky top-0 z-50 flex w-full flex-col bg-[#ffffff] dark:bg-[#0a0a0a]'>
      <NavbarHeader />

      <div className='border-divider/60 w-full border-b'>
        <div className='container mx-auto flex items-center justify-between gap-4 px-6 py-4'>
          <div className='hidden flex-1 lg:block'>
            <div className='group relative max-w-[300px]'>
              <Input
                size='sm'
                variant='underlined'
                classNames={{
                  input: ['text-xs uppercase tracking-widest'],
                  inputWrapper: [
                    'border-b border-divider group-hover:border-primary transition-all duration-500',
                    'after:bg-primary',
                  ],
                }}
                placeholder={t('search')}
                startContent={
                  <SearchIcon size={16} className='text-default-400' />
                }
              />
            </div>
          </div>

          <div className='flex shrink-0 items-center justify-center'>
            <img
              src='/images/logo.png'
              alt='Logo'
              className='h-12 w-auto cursor-pointer transition-opacity hover:opacity-80 md:h-16'
              onClick={() => router.push('/')}
            />
          </div>

          <div className='flex flex-1 items-center justify-end gap-5'>
            <div className='flex items-center gap-4'>
              <Button
                isIconOnly
                variant='light'
                className='text-default-600 lg:hidden'
              >
                <SearchIcon size={22} strokeWidth={1.5} />
              </Button>

              {session ? (
                <NavbarPanel />
              ) : (
                <Button
                  isIconOnly
                  variant='light'
                  className='text-default-600'
                  onClick={() => {
                    router.push('/login')
                  }}
                >
                  <LogInIcon size={22} strokeWidth={1.5} />
                </Button>
              )}

              <div className='bg-divider h-4 w-[1px]' />

              <NavbarCart />
              {/* <Badge
                color='primary'
                content={'99+'}
                className='bg-primary border-none font-bold text-white'
                shape='circle'
              >
                <Button
                  isIconOnly
                  variant='light'
                  radius='full'
                  className='text-default-600 transition-all hover:scale-110'
                  onClick={() => router.push('/cart')}
                >
                  <ShoppingCartIcon size={22} strokeWidth={1.5} />
                </Button>
              </Badge> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button, Input } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='sticky top-0 z-50 flex w-full flex-col bg-[#050505ec] text-white backdrop-blur-md'>
//       <NavbarHeader />

//       <div className='border-primary/30 relative w-full border-b py-3'>
//         <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] opacity-[0.05]' />

//         <div className='relative z-10 container mx-auto flex items-center justify-between gap-4 px-5'>
//           <div className='flex shrink-0 items-center'>
//             <div
//               className='bg-primary/10 hover:bg-primary/20 relative flex size-12 cursor-pointer items-center justify-center transition-all [clip-path:polygon(20%_0%,100%_0%,100%_80%,80%_100%,0%_100%,0%_20%)] md:size-16'
//               onClick={() => router.push('/')}
//             >
//               <img
//                 src='/images/logo.png'
//                 alt='Logo'
//                 className='size-8 object-contain md:size-11'
//               />
//               <div className='border-primary/50 absolute inset-0 border [clip-path:polygon(20%_0%,100%_0%,100%_80%,80%_100%,0%_100%,0%_20%)]' />
//             </div>
//           </div>

//           <div className='hidden max-w-xl flex-1 lg:block'>
//             <Input
//               size='md'
//               classNames={{
//                 input: [
//                   '!text-primary font-mono text-xs uppercase placeholder:text-primary/40',
//                 ],
//                 inputWrapper: [
//                   'bg-black/40',
//                   'border-x-2 border-primary/40',
//                   'group-data-[focus=true]:border-primary',
//                   'group-data-[focus=true]:bg-black/60',
//                   'transition-all duration-300 shadow-[0_0_10px_rgba(var(--heroui-primary-rgb),0.1)]',
//                   'after:hidden',
//                 ],
//               }}
//               variant='bordered'
//               placeholder={`// EXECUTE_SEARCH...`}
//               endContent={
//                 <SearchIcon className='text-primary animate-pulse' size={18} />
//               }
//             />
//           </div>

//           <div className='flex items-center gap-2'>
//             {session ? (
//               <NavbarPanel />
//             ) : (
//               <Button
//                 variant='bordered'
//                 className='border-primary/50 text-primary hover:bg-primary font-mono text-xs [clip-path:polygon(10%_0,100%_0,100%_70%,90%_100%,0_100%,0_30%)] hover:text-black'
//                 startContent={<LogInIcon size={16} />}
//                 onClick={() => router.push('/login')}
//               >
//                 LOGIN_SYS
//               </Button>
//             )}

//             <Badge
//               color='primary'
//               content={'99+'}
//               className='border-none font-black text-black shadow-[0_0_10px_rgba(var(--heroui-primary-rgb),1)]'
//               shape='circle'
//             >
//               <Button
//                 isIconOnly
//                 variant='light'
//                 className='text-primary hover:bg-primary/10'
//                 onClick={() => router.push('/cart')}
//               >
//                 <ShoppingCartIcon size={24} strokeWidth={1.5} />
//               </Button>
//             </Badge>

//             <Button
//               isIconOnly
//               variant='light'
//               className='text-primary lg:hidden'
//             >
//               <SearchIcon size={22} />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button, Input } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const t = useTranslations('Navbar')
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='sticky top-0 z-50 flex w-full flex-col bg-[#fdfbf9]/90 backdrop-blur-md dark:bg-[#0e0e0e]/90'>
//       <NavbarHeader />

//       <div className='relative w-full overflow-hidden border-b border-stone-200/60 dark:border-white/5'>
//         <div className='bg-primary/5 absolute -top-10 left-1/4 size-40 rounded-full blur-3xl' />

//         <div className='relative z-10 container mx-auto flex items-center justify-between gap-4 px-6 py-4'>
//           <div
//             className='flex size-14 cursor-pointer items-center justify-center [border-radius:60%_40%_30%_70%/60%_30%_70%_40%] bg-white shadow-sm transition-all duration-700 hover:[border-radius:40%_60%_70%_30%/40%_70%_30%_60%] dark:bg-stone-800'
//             onClick={() => router.push('/')}
//           >
//             <img
//               src='/images/logo.png'
//               alt='Logo'
//               className='size-9 object-contain'
//             />
//           </div>

//           <div className='hidden max-w-lg flex-1 lg:block'>
//             <Input
//               size='md'
//               classNames={{
//                 input: ['text-sm italic text-stone-600'],
//                 inputWrapper: [
//                   'bg-stone-100/50 dark:bg-stone-800/50',
//                   'rounded-[2rem] rounded-tr-none rounded-bl-none',
//                   'border-none shadow-inner',
//                   'group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-stone-800',
//                   'group-data-[focus=true]:rounded-2xl transition-all duration-500',
//                 ],
//               }}
//               placeholder={t('search')}
//               startContent={
//                 <SearchIcon size={18} className='ml-2 text-stone-400' />
//               }
//             />
//           </div>

//           <div className='flex items-center gap-3'>
//             <div className='flex items-center gap-2 rounded-full bg-stone-100/50 px-2 py-1 dark:bg-stone-800/50'>
//               {session ? (
//                 <NavbarPanel />
//               ) : (
//                 <Button
//                   variant='light'
//                   radius='full'
//                   className='hover:text-primary font-medium text-stone-600 italic'
//                   startContent={<LogInIcon size={18} />}
//                   onClick={() => router.push('/login')}
//                 >
//                   <span className='hidden md:inline'>{t('login')}</span>
//                 </Button>
//               )}

//               <Badge
//                 color='primary'
//                 content={'99+'}
//                 className='border-2 border-[#fdfbf9] text-[10px] font-bold text-white dark:border-[#0e0e0e]'
//                 shape='circle'
//               >
//                 <Button
//                   isIconOnly
//                   variant='flat'
//                   className='bg-primary/10 text-primary [border-radius:30%_70%_70%_30%/50%_30%_70%_50%] transition-all duration-500 hover:rounded-full'
//                   onClick={() => router.push('/cart')}
//                 >
//                   <ShoppingCartIcon size={20} />
//                 </Button>
//               </Badge>
//             </div>

//             <Button
//               isIconOnly
//               variant='light'
//               className='text-stone-500 lg:hidden'
//             >
//               <SearchIcon size={22} />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const t = useTranslations('Navbar')
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='bg-background sticky top-0 z-50 flex w-full flex-col'>
//       <NavbarHeader />

//       <div className='border-divider w-full border-b'>
//         <div className='container mx-auto flex h-16 items-stretch gap-0 px-0 md:h-24'>
//           <div
//             className='border-divider hover:bg-default-50 active:bg-default-100 flex shrink-0 cursor-pointer items-center justify-center border-r px-6 transition-all md:px-12'
//             onClick={() => router.push('/')}
//           >
//             <img
//               src='/images/logo.png'
//               alt='Logo'
//               className='h-10 w-auto object-contain transition-transform hover:scale-105 md:h-14'
//             />
//           </div>

//           <div className='flex flex-1 items-center px-4 md:px-10'>
//             <div className='border-divider bg-default-50 focus-within:border-primary focus-within:bg-background focus-within:ring-primary/10 flex w-full max-w-2xl items-center gap-3 rounded-full border px-4 py-2 transition-all focus-within:ring-4'>
//               <SearchIcon size={20} className='text-default-400' />
//               <input
//                 className='placeholder:text-default-400 w-full bg-transparent text-sm font-medium outline-none'
//                 placeholder={t('search')}
//               />
//               <div className='bg-default-200 hidden items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold md:flex'>
//                 ESC
//               </div>
//             </div>
//           </div>

//           <div className='flex items-stretch'>
//             <div className='border-divider hover:bg-default-50 flex items-center border-l px-2 transition-colors md:px-8'>
//               {session ? (
//                 <NavbarPanel />
//               ) : (
//                 <Button
//                   variant='light'
//                   radius='none'
//                   className='h-full px-4 text-xs font-black tracking-widest uppercase'
//                   startContent={<LogInIcon size={20} />}
//                   onClick={() => router.push('/login')}
//                 >
//                   <span className='hidden lg:inline'>Sign In</span>
//                 </Button>
//               )}
//             </div>

//             <div
//               className='group bg-primary/5 border-divider hover:bg-primary flex w-16 cursor-pointer flex-col items-center justify-center gap-1 border-l transition-all hover:text-white md:w-28'
//               onClick={() => router.push('/cart')}
//             >
//               <Badge
//                 color='primary'
//                 content={'99'}
//                 className='border-background group-hover:text-primary border-2 font-bold group-hover:bg-white'
//                 shape='circle'
//                 size='sm'
//               >
//                 <ShoppingCartIcon size={26} strokeWidth={2} />
//               </Badge>
//               <span className='hidden text-[10px] font-black tracking-tighter uppercase md:block'>
//                 My Cart
//               </span>
//             </div>
//           </div>

//           <Button
//             isIconOnly
//             variant='light'
//             radius='none'
//             className='border-divider h-full border-l lg:hidden'
//           >
//             <SearchIcon size={22} />
//           </Button>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { Badge, Button } from '@heroui/react'
// import { LogInIcon, SearchIcon, ShoppingCartIcon, Cpu } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'

// import { NavbarHeader } from './header'
// import { NavbarPanel } from './panel'

// export const Navbar = () => {
//   const { data: session } = useSession()
//   const router = useRouter()

//   return (
//     <nav className='sticky top-0 z-50 flex w-full flex-col bg-black font-mono text-zinc-400'>
//       <NavbarHeader />

//       <div className='w-full border-b border-zinc-800 bg-[#0a0a0a]'>
//         <div className='container mx-auto flex h-14 items-stretch gap-0 px-0 md:h-16'>
//           <div
//             className='group flex shrink-0 cursor-pointer items-center border-r border-zinc-800 px-4 transition-all hover:bg-zinc-900 md:px-8'
//             onClick={() => router.push('/')}
//           >
//             <div className='flex items-center gap-4'>
//               <div className='relative'>
//                 <div className='bg-primary/20 group-hover:bg-primary/40 absolute -inset-1 animate-pulse rounded-sm blur-sm' />
//                 <img
//                   src='/images/logo.png'
//                   alt='Logo'
//                   className='relative size-8 object-contain brightness-125 grayscale group-hover:grayscale-0 md:size-10'
//                 />
//               </div>
//               <div className='hidden flex-col border-l border-zinc-700 pl-4 md:flex'>
//                 <span className='text-[10px] font-bold tracking-widest text-zinc-200'>
//                   ROOT://STORE
//                 </span>
//                 <span className='text-primary flex items-center gap-1 text-[8px]'>
//                   <Cpu size={10} /> LOCAL_HOST:3000
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className='flex flex-1 items-center bg-black/50 px-4'>
//             <div className='flex w-full items-center gap-3'>
//               <span className='text-primary opacity-50'>{'>_'}</span>
//               <input
//                 className='w-full bg-transparent text-[11px] font-medium tracking-[0.2em] text-zinc-300 uppercase outline-none placeholder:text-zinc-700'
//                 placeholder='RUN_SEARCH_SEQUENCE...'
//               />
//               <div className='hidden items-center gap-4 lg:flex'>
//                 <div className='h-[1px] w-12 bg-zinc-800' />
//                 <span className='text-[9px] text-zinc-600'>
//                   LN: 01, COL: 42
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className='flex items-stretch'>
//             <div className='flex items-center border-l border-zinc-800 px-2 transition-all hover:bg-zinc-900 md:px-6'>
//               {session ? (
//                 <div className='scale-90 brightness-75 transition-all hover:brightness-100'>
//                   <NavbarPanel />
//                 </div>
//               ) : (
//                 <Button
//                   variant='light'
//                   radius='none'
//                   className='hover:text-primary h-full px-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase'
//                   startContent={
//                     <LogInIcon size={16} className='text-primary' />
//                   }
//                   onClick={() => router.push('/login')}
//                 >
//                   <span className='hidden lg:inline'>ID_VERIFY</span>
//                 </Button>
//               )}
//             </div>

//             <div
//               className='group hover:bg-primary/10 flex w-16 cursor-pointer flex-col items-center justify-center border-l border-zinc-800 transition-all md:w-28'
//               onClick={() => router.push('/cart')}
//             >
//               <Badge
//                 color='primary'
//                 content={'99'}
//                 className='rounded-none font-bold'
//                 shape='rectangle'
//                 size='sm'
//               >
//                 <div className='flex flex-col items-center gap-1'>
//                   <ShoppingCartIcon
//                     size={20}
//                     className='group-hover:text-primary text-zinc-400'
//                   />
//                   <span className='group-hover:text-primary hidden text-[8px] font-black tracking-tighter uppercase md:block'>
//                     INVENTORY
//                   </span>
//                 </div>
//               </Badge>
//               <div className='bg-primary absolute bottom-0 h-[2px] w-0 transition-all group-hover:w-full' />
//             </div>
//           </div>

//           <Button
//             isIconOnly
//             variant='light'
//             radius='none'
//             className='h-full border-l border-zinc-800 text-zinc-500 lg:hidden'
//           >
//             <SearchIcon size={18} />
//           </Button>
//         </div>
//       </div>
//     </nav>
//   )
// }
