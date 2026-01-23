// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='border-divider flex size-12 items-center justify-center rounded-md border bg-white p-2 sm:size-14'>
//     <img
//       src={src}
//       alt={alt}
//       className={cn(
//         'h-8 w-auto cursor-pointer object-contain transition-all duration-300',
//         hoverEffect && 'hover:scale-105',
//       )}
//     />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = tFooter.raw('Menu') as FooterMenuSection[]

//   return (
//     <footer
//       className={cn(
//         'border-primary flex w-full flex-col items-center justify-between gap-2 border-t-4 bg-white px-5 py-2.5 dark:bg-[#131314]',
//         className,
//       )}
//       {...props}
//     >
//       <div className='border-divider container mx-auto grid justify-start gap-10 border-b py-10 text-sm sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
//         {menuData.map((section, idx) => (
//           <div key={`section-${idx}`} className='flex flex-col gap-4'>
//             {!section.isGroup && section.title && (
//               <span className='font-bold tracking-wider text-gray-900 uppercase dark:text-gray-100'>
//                 {section.title}
//               </span>
//             )}

//             {section.isGroup && (
//               <div className='flex flex-col gap-8'>
//                 {section.subSections?.map((sub, sIdx) => (
//                   <div
//                     key={`sub-${idx}-${sIdx}`}
//                     className='flex flex-col gap-2'
//                   >
//                     <span className='font-bold tracking-wider uppercase'>
//                       {sub.title}
//                     </span>
//                     <div className='flex flex-wrap gap-2'>
//                       {sub.isShipping &&
//                         SHIPPING_PROVIDERS.map((shipping, i) => (
//                           <FooterIcon
//                             key={`ship-${i}`}
//                             src={shipping?.image}
//                             alt='shipping'
//                           />
//                         ))}
//                       {sub.isPayment &&
//                         sub.items?.map((img, i) => (
//                           <FooterIcon
//                             key={`pay-${i}`}
//                             src={img}
//                             alt='payment'
//                           />
//                         ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {(section.isMarketplace || section.isCertificate) && (
//               <div className='mt-1 flex flex-wrap gap-2'>
//                 {section.items?.map((item, imgIdx) => {
//                   if (typeof item !== 'string') return null
//                   return (
//                     <FooterIcon
//                       key={`img-${imgIdx}`}
//                       src={item}
//                       alt='partner'
//                       hoverEffect={section.isMarketplace}
//                     />
//                   )
//                 })}
//               </div>
//             )}

//             {section.maps?.map((mapSrc, mIdx) => (
//               <div
//                 key={`map-${mIdx}`}
//                 className='border-divider overflow-hidden rounded-lg border'
//               >
//                 <iframe
//                   title={`map-${idx}-${mIdx}`}
//                   src={mapSrc}
//                   className='h-32 w-full border-0'
//                   loading='lazy'
//                 />
//               </div>
//             ))}

//             {!section.isGroup &&
//               !section.isMarketplace &&
//               !section.isCertificate && (
//                 <nav className='flex flex-col gap-2'>
//                   {section.items?.map((link, lIdx) => {
//                     if (
//                       typeof link === 'object' &&
//                       link !== null &&
//                       'href' in link
//                     ) {
//                       return (
//                         <a
//                           key={`link-${lIdx}`}
//                           href={link.href}
//                           className='hover:text-primary transition-colors'
//                         >
//                           {link.label}
//                         </a>
//                       )
//                     }
//                     return null
//                   })}
//                 </nav>
//               )}
//           </div>
//         ))}
//       </div>

//       <div className='container mx-auto flex flex-wrap justify-between gap-4 py-6 text-[13px] text-gray-500'>
//         <div className='flex items-center gap-1 font-medium'>
//           <span>
//             {tFooter('copyright', {
//               year,
//               name: tSite('name'),
//             })}
//           </span>
//         </div>

//         <div className='flex flex-wrap items-center gap-1'>
//           <span className='mr-1 font-medium'>{tFooter('country')}</span>
//           {CURRENCY_LOCALE_MAP.map((item) => (
//             <button
//               key={item.country}
//               className='hover:text-primary border-divider cursor-pointer border-r px-2 transition-colors last:border-0 last:pr-0'
//             >
//               {tCountry(item.country)}
//             </button>
//           ))}
//         </div>
//       </div>
//     </footer>
//   )
// }

/* eslint-disable @next/next/no-img-element */
'use client'

import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
import { cn } from '@/utils/style'

interface FooterIconProps {
  src: string
  alt: string
  hoverEffect?: boolean
}

const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
  <div className='border-divider hover:border-primary flex size-12 items-center justify-center rounded-full border bg-white p-2.5 shadow-sm transition-all duration-300 sm:size-14'>
    <img
      src={src}
      alt={alt}
      className={cn(
        'h-full w-auto cursor-pointer object-contain transition-all duration-300',
        hoverEffect && 'hover:scale-110',
      )}
    />
  </div>
)

interface FooterLink {
  label: string
  href: string
}

interface FooterSubSection {
  title: string
  isShipping?: boolean
  isPayment?: boolean
  items?: string[]
}

interface FooterMenuSection {
  title?: string
  isGroup?: boolean
  isMarketplace?: boolean
  isCertificate?: boolean
  subSections?: FooterSubSection[]
  items?: (string | FooterLink)[]
  maps?: string[]
}

type FooterProps = ComponentProps<'footer'>

export const Footer = ({ className, ...props }: FooterProps) => {
  const tFooter = useTranslations('Footer')
  const tSite = useTranslations('Site')
  const tCountry = useTranslations('Country')
  const year = new Date().getFullYear()

  const menuData = tFooter.raw('Menu') as FooterMenuSection[]

  return (
    <footer
      className={cn(
        'border-divider flex w-full flex-col items-center justify-between border-t bg-white px-5 py-4 dark:bg-[#131314]',
        className,
      )}
      {...props}
    >
      <div className='container mx-auto grid justify-start gap-12 py-16 text-sm sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
        {menuData.map((section, idx) => (
          <div key={`section-${idx}`} className='flex flex-col gap-6'>
            {!section.isGroup && section.title && (
              <span className='text-primary text-base font-bold tracking-tight uppercase'>
                {section.title}
              </span>
            )}

            {section.isGroup && (
              <div className='flex flex-col gap-10'>
                {section.subSections?.map((sub, sIdx) => (
                  <div
                    key={`sub-${idx}-${sIdx}`}
                    className='flex flex-col gap-4'
                  >
                    <span className='text-xs font-bold tracking-wide text-gray-900 uppercase dark:text-gray-100'>
                      {sub.title}
                    </span>
                    <div className='flex flex-wrap gap-3'>
                      {sub.isShipping &&
                        SHIPPING_PROVIDERS.map((shipping, i) => (
                          <FooterIcon
                            key={`ship-${i}`}
                            src={shipping?.image}
                            alt='shipping'
                          />
                        ))}
                      {sub.isPayment &&
                        sub.items?.map((img, i) => (
                          <FooterIcon
                            key={`pay-${i}`}
                            src={img}
                            alt='payment'
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(section.isMarketplace || section.isCertificate) && (
              <div className='flex flex-wrap gap-3'>
                {section.items?.map((item, imgIdx) => {
                  if (typeof item !== 'string') return null
                  return (
                    <FooterIcon
                      key={`img-${imgIdx}`}
                      src={item}
                      alt='partner'
                      hoverEffect={section.isMarketplace}
                    />
                  )
                })}
              </div>
            )}

            {section.maps?.map((mapSrc, mIdx) => (
              <div
                key={`map-${mIdx}`}
                className='border-divider overflow-hidden rounded-2xl border-2 shadow-inner'
              >
                <iframe
                  title={`map-${idx}-${mIdx}`}
                  src={mapSrc}
                  className='h-36 w-full contrast-[0.8] grayscale transition-all duration-700 hover:grayscale-0'
                  loading='lazy'
                />
              </div>
            ))}

            {!section.isGroup &&
              !section.isMarketplace &&
              !section.isCertificate && (
                <nav className='flex flex-col gap-3'>
                  {section.items?.map((link, lIdx) => {
                    if (
                      typeof link === 'object' &&
                      link !== null &&
                      'href' in link
                    ) {
                      return (
                        <a
                          key={`link-${lIdx}`}
                          href={link.href}
                          className='hover:text-primary text-gray-500 transition-all duration-300 hover:translate-x-1 dark:text-gray-400'
                        >
                          {link.label}
                        </a>
                      )
                    }
                    return null
                  })}
                </nav>
              )}
          </div>
        ))}
      </div>

      <div className='border-divider container mx-auto flex flex-col items-center justify-between gap-6 border-t py-8 text-[12px] text-gray-400 md:flex-row'>
        <div className='flex flex-col items-center gap-1 md:items-start'>
          <p className='font-medium'>
            {tFooter('copyright', { year, name: tSite('name') })}
          </p>
          <div className='bg-primary/20 h-1 w-12 rounded-full' />{' '}
        </div>

        <div className='flex flex-wrap items-center justify-center gap-2'>
          <span className='tracking-tighter uppercase'>
            {tFooter('country')}
          </span>
          {CURRENCY_LOCALE_MAP.map((item) => (
            <button
              key={item.country}
              className='hover:bg-primary/10 hover:text-primary border-divider rounded-full border px-3 py-1 transition-all'
            >
              {tCountry(item.country)}
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='bg-content2 hover:bg-content3 flex size-12 items-center justify-center rounded-xl p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:size-14'>
//     <img
//       src={src}
//       alt={alt}
//       className={cn(
//         'h-7 w-auto cursor-pointer object-contain transition-all duration-300',
//         hoverEffect && 'hover:scale-105',
//       )}
//     />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = tFooter.raw('Menu') as FooterMenuSection[]

//   return (
//     <footer
//       className={cn(
//         'bg-content1 text-foreground w-full px-5 pt-16 pb-8 transition-colors dark:bg-[#131314]',
//         className,
//       )}
//       {...props}
//     >
//       <div className='container mx-auto'>
//         <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
//           {menuData.map((section, idx) => (
//             <div
//               key={`section-${idx}`}
//               className='bg-content2/30 hover:bg-content2/50 flex flex-col gap-5 rounded-[2rem] p-6 transition-all dark:bg-white/5'
//             >
//               {!section.isGroup && section.title && (
//                 <span className='text-primary text-lg font-extrabold tracking-tight'>
//                   {section.title}
//                 </span>
//               )}

//               {section.isGroup && (
//                 <div className='flex flex-col gap-8'>
//                   {section.subSections?.map((sub, sIdx) => (
//                     <div
//                       key={`sub-${idx}-${sIdx}`}
//                       className='flex flex-col gap-3'
//                     >
//                       <span className='text-xs font-black tracking-widest uppercase opacity-60'>
//                         {sub.title}
//                       </span>
//                       <div className='flex flex-wrap gap-2'>
//                         {sub.isShipping &&
//                           SHIPPING_PROVIDERS.map((shipping, i) => (
//                             <FooterIcon
//                               key={`ship-${i}`}
//                               src={shipping?.image}
//                               alt='shipping'
//                             />
//                           ))}
//                         {sub.isPayment &&
//                           sub.items?.map((img, i) => (
//                             <FooterIcon
//                               key={`pay-${i}`}
//                               src={img}
//                               alt='payment'
//                             />
//                           ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {(section.isMarketplace || section.isCertificate) && (
//                 <div className='flex flex-wrap gap-2'>
//                   {section.items?.map((item, imgIdx) => {
//                     if (typeof item !== 'string') return null
//                     return (
//                       <FooterIcon
//                         key={`img-${imgIdx}`}
//                         src={item}
//                         alt='partner'
//                         hoverEffect={section.isMarketplace}
//                       />
//                     )
//                   })}
//                 </div>
//               )}

//               {section.maps?.map((mapSrc, mIdx) => (
//                 <div
//                   key={`map-${mIdx}`}
//                   className='overflow-hidden rounded-2xl shadow-lg'
//                 >
//                   <iframe
//                     title={`map-${idx}-${mIdx}`}
//                     src={mapSrc}
//                     className='h-32 w-full border-0'
//                     loading='lazy'
//                   />
//                 </div>
//               ))}

//               {!section.isGroup &&
//                 !section.isMarketplace &&
//                 !section.isCertificate && (
//                   <nav className='flex flex-col gap-2.5'>
//                     {section.items?.map((link, lIdx) => {
//                       if (
//                         typeof link === 'object' &&
//                         link !== null &&
//                         'href' in link
//                       ) {
//                         return (
//                           <a
//                             key={`link-${lIdx}`}
//                             href={link.href}
//                             className='group hover:text-primary flex items-center gap-2 font-medium opacity-70 transition-all hover:opacity-100'
//                           >
//                             <div className='bg-primary h-1.5 w-1.5 rounded-full opacity-0 transition-all group-hover:opacity-100' />
//                             {link.label}
//                           </a>
//                         )
//                       }
//                       return null
//                     })}
//                   </nav>
//                 )}
//             </div>
//           ))}
//         </div>

//         <div className='border-divider mt-16 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row'>
//           <div className='flex flex-col gap-1 text-center md:text-left'>
//             <span className='text-primary text-xl font-black'>
//               {tSite('name')}
//             </span>
//             <p className='text-sm font-medium opacity-50'>
//               {tFooter('copyright', { year, name: '' })}
//             </p>
//           </div>

//           <div className='bg-content2 flex flex-wrap items-center justify-center gap-2 rounded-2xl p-2'>
//             {CURRENCY_LOCALE_MAP.map((item) => (
//               <button
//                 key={item.country}
//                 className='hover:bg-primary rounded-xl px-4 py-2 text-xs font-bold transition-all hover:text-white'
//               >
//                 {tCountry(item.country)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='flex size-12 items-center justify-center rounded-2xl border border-white/40 bg-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white/40 hover:shadow-lg sm:size-14 dark:border-white/10 dark:bg-white/5'>
//     <img
//       src={src}
//       alt={alt}
//       className={cn(
//         'h-7 w-auto object-contain contrast-[0.9] transition-all duration-300',
//         hoverEffect && 'hover:scale-110',
//       )}
//     />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = tFooter.raw('Menu') as FooterMenuSection[]

//   return (
//     <footer
//       className={cn(
//         'relative w-full border-t border-white/20 bg-white/40 px-5 py-12 backdrop-blur-2xl dark:border-white/5 dark:bg-[#0c0c0d]/60',
//         className,
//       )}
//       {...props}
//     >
//       <div className='container mx-auto'>
//         <div className='grid gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
//           {menuData.map((section, idx) => (
//             <div key={`section-${idx}`} className='flex flex-col gap-6'>
//               {!section.isGroup && section.title && (
//                 <span className='text-foreground/60 text-xs font-black tracking-[0.2em] uppercase'>
//                   {section.title}
//                 </span>
//               )}

//               {section.isGroup && (
//                 <div className='flex flex-col gap-10'>
//                   {section.subSections?.map((sub, sIdx) => (
//                     <div
//                       key={`sub-${idx}-${sIdx}`}
//                       className='flex flex-col gap-4'
//                     >
//                       <span className='text-[10px] font-bold tracking-widest uppercase opacity-50'>
//                         {sub.title}
//                       </span>
//                       <div className='flex flex-wrap gap-2.5'>
//                         {sub.isShipping &&
//                           SHIPPING_PROVIDERS.map((shipping, i) => (
//                             <FooterIcon
//                               key={`ship-${i}`}
//                               src={shipping?.image}
//                               alt='shipping'
//                             />
//                           ))}
//                         {sub.isPayment &&
//                           sub.items?.map((img, i) => (
//                             <FooterIcon
//                               key={`pay-${i}`}
//                               src={img}
//                               alt='payment'
//                             />
//                           ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {(section.isMarketplace || section.isCertificate) && (
//                 <div className='flex flex-wrap gap-2.5'>
//                   {section.items?.map(
//                     (item, imgIdx) =>
//                       typeof item === 'string' && (
//                         <FooterIcon
//                           key={`img-${imgIdx}`}
//                           src={item}
//                           alt='partner'
//                           hoverEffect={section.isMarketplace}
//                         />
//                       ),
//                   )}
//                 </div>
//               )}

//               {section.maps?.map((mapSrc, mIdx) => (
//                 <div
//                   key={`map-${mIdx}`}
//                   className='overflow-hidden rounded-3xl border border-white/40 p-1 shadow-sm backdrop-blur-md'
//                 >
//                   <iframe
//                     title={`map-${idx}-${mIdx}`}
//                     src={mapSrc}
//                     className='h-32 w-full rounded-[1.2rem] opacity-80 transition-opacity hover:opacity-100'
//                     loading='lazy'
//                   />
//                 </div>
//               ))}

//               {!section.isGroup &&
//                 !section.isMarketplace &&
//                 !section.isCertificate && (
//                   <nav className='flex flex-col gap-3'>
//                     {section.items?.map(
//                       (link, lIdx) =>
//                         typeof link === 'object' &&
//                         link !== null &&
//                         'href' in link && (
//                           <a
//                             key={`link-${lIdx}`}
//                             href={link.href}
//                             className='text-foreground/70 hover:text-primary text-sm transition-all hover:pl-1'
//                           >
//                             {link.label}
//                           </a>
//                         ),
//                     )}
//                   </nav>
//                 )}
//             </div>
//           ))}
//         </div>

//         <div className='mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/20 pt-8 md:flex-row dark:border-white/10'>
//           <div className='text-center md:text-left'>
//             <p className='text-[11px] font-medium tracking-widest uppercase opacity-50'>
//               {tFooter('copyright', { year, name: tSite('name') })}
//             </p>
//           </div>

//           <div className='flex items-center gap-1'>
//             {CURRENCY_LOCALE_MAP.map((item) => (
//               <button
//                 key={item.country}
//                 className='hover:text-primary px-3 py-1 text-[10px] font-bold tracking-tighter uppercase opacity-40 transition-all hover:opacity-100'
//               >
//                 {tCountry(item.country)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='border-divider bg-content2 hover:border-primary hover:bg-content3 flex size-11 items-center justify-center rounded-lg border p-1.5 transition-all duration-300 sm:size-12'>
//     <img
//       src={src || ''}
//       alt={alt}
//       className={cn(
//         'h-full w-auto object-contain transition-all duration-300',
//         hoverEffect && 'hover:scale-105',
//       )}
//     />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = (tFooter.raw('Menu') as FooterMenuSection[]) || []

//   return (
//     <footer
//       className={cn(
//         'bg-content1 text-foreground w-full p-4 dark:bg-[#131314]',
//         className,
//       )}
//       {...props}
//     >
//       <div className='container mx-auto grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6'>
//         {menuData.map((section, idx) => {
//           const isWide = section.isGroup || section.maps

//           return (
//             <div
//               key={`bento-${idx}`}
//               className={cn(
//                 'border-divider bg-content1 hover:border-primary/30 relative flex flex-col gap-4 overflow-hidden rounded-[1.5rem] border p-6 transition-all',
//                 isWide ? 'md:col-span-2' : 'col-span-1',
//               )}
//             >
//               {!section.isGroup && section.title && (
//                 <span className='text-primary text-sm font-bold tracking-widest uppercase'>
//                   {section.title}
//                 </span>
//               )}

//               {section.isGroup &&
//                 section.subSections?.map((sub, sIdx) => (
//                   <div
//                     key={`sub-${idx}-${sIdx}`}
//                     className='flex flex-col gap-3'
//                   >
//                     <span className='text-[10px] font-black uppercase opacity-50'>
//                       {sub.title}
//                     </span>
//                     <div className='flex flex-wrap gap-2'>
//                       {sub.isShipping &&
//                         SHIPPING_PROVIDERS?.map((s, i) => (
//                           <FooterIcon
//                             key={`ship-${i}`}
//                             src={s?.image}
//                             alt='shipping'
//                           />
//                         ))}
//                       {sub.isPayment &&
//                         sub.items?.map((img, i) => (
//                           <FooterIcon
//                             key={`pay-${i}`}
//                             src={img}
//                             alt='payment'
//                           />
//                         ))}
//                     </div>
//                   </div>
//                 ))}

//               {(section.isMarketplace || section.isCertificate) && (
//                 <div className='flex flex-wrap gap-2'>
//                   {section.items?.map(
//                     (item, i) =>
//                       typeof item === 'string' && (
//                         <FooterIcon
//                           key={`item-${i}`}
//                           src={item}
//                           alt='partner'
//                           hoverEffect={section.isMarketplace}
//                         />
//                       ),
//                   )}
//                 </div>
//               )}

//               {section.maps?.map((mapSrc, i) => (
//                 <div
//                   key={`map-${i}`}
//                   className='mt-auto h-32 w-full overflow-hidden rounded-xl grayscale transition-all duration-500 hover:grayscale-0'
//                 >
//                   <iframe
//                     title='map'
//                     src={mapSrc}
//                     className='h-full w-full border-0'
//                     loading='lazy'
//                   />
//                 </div>
//               ))}

//               {!section.isGroup &&
//                 !section.isMarketplace &&
//                 !section.isCertificate &&
//                 !section.maps && (
//                   <nav className='flex flex-col gap-2'>
//                     {section.items?.map(
//                       (link, i) =>
//                         typeof link === 'object' &&
//                         link !== null && (
//                           <a
//                             key={`l-${i}`}
//                             href={link.href}
//                             className='hover:text-primary text-sm opacity-70 transition-all hover:opacity-100'
//                           >
//                             {link.label}
//                           </a>
//                         ),
//                     )}
//                   </nav>
//                 )}
//             </div>
//           )
//         })}

//         <div className='bg-content2 flex flex-col items-center justify-between gap-4 rounded-[1.2rem] p-4 md:col-span-4 md:flex-row lg:col-span-6'>
//           <div className='flex flex-col items-center gap-1 md:items-start'>
//             <span className='text-xs font-bold'>{tSite('name')}</span>
//             <p className='text-[10px] opacity-50'>
//               {tFooter('copyright', { year, name: '' })}
//             </p>
//           </div>

//           <div className='flex flex-wrap gap-2'>
//             {CURRENCY_LOCALE_MAP?.map((item) => (
//               <button
//                 key={item.country}
//                 className='bg-content1 hover:bg-primary rounded-lg px-3 py-1 text-[10px] font-bold transition-all hover:text-white'
//               >
//                 {tCountry(item.country)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='group border-divider hover:border-primary relative flex size-12 items-center justify-center overflow-hidden border bg-white transition-all duration-500 sm:size-14 dark:bg-black'>
//     <img
//       src={src || ''}
//       alt={alt}
//       className={cn(
//         'h-7 w-auto object-contain grayscale transition-all duration-700 group-hover:grayscale-0',
//         hoverEffect && 'group-hover:scale-110',
//       )}
//     />
//     <div className='bg-primary absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full' />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = (tFooter.raw('Menu') as FooterMenuSection[]) || []

//   return (
//     <footer
//       className={cn(
//         'border-divider text-foreground w-full border-t bg-white transition-colors dark:bg-[#0a0a0a]',
//         className,
//       )}
//       {...props}
//     >
//       <div className='border-divider border-b py-10 text-center'>
//         <h2 className='text-default-400 text-xs font-medium tracking-[0.8em] uppercase'>
//           Welcome to
//         </h2>
//         <h1 className='mt-2 text-4xl font-light tracking-[0.3em] uppercase sm:text-5xl'>
//           {tSite('name')}
//         </h1>
//       </div>

//       <div className='container mx-auto px-5 py-16'>
//         <div className='grid gap-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
//           {menuData.map((section, idx) => (
//             <div key={`section-${idx}`} className='flex flex-col gap-8'>
//               {!section.isGroup && section.title && (
//                 <div className='flex items-center gap-4'>
//                   <span className='text-xs font-bold tracking-[0.3em] uppercase'>
//                     {section.title}
//                   </span>
//                   <div className='bg-divider h-[1px] flex-1' />
//                 </div>
//               )}

//               {section.isGroup &&
//                 section.subSections?.map((sub, sIdx) => (
//                   <div
//                     key={`sub-${idx}-${sIdx}`}
//                     className='flex flex-col gap-5'
//                   >
//                     <span className='text-primary text-[10px] font-bold tracking-widest uppercase'>
//                       {sub.title}
//                     </span>
//                     <div className='flex flex-wrap gap-3'>
//                       {sub.isShipping &&
//                         SHIPPING_PROVIDERS?.map((s, i) => (
//                           <FooterIcon
//                             key={`ship-${i}`}
//                             src={s?.image}
//                             alt='shipping'
//                           />
//                         ))}
//                       {sub.isPayment &&
//                         sub.items?.map((img, i) => (
//                           <FooterIcon
//                             key={`pay-${i}`}
//                             src={img}
//                             alt='payment'
//                           />
//                         ))}
//                     </div>
//                   </div>
//                 ))}

//               {(section.isMarketplace || section.isCertificate) && (
//                 <div className='flex flex-wrap gap-3'>
//                   {section.items?.map(
//                     (item, i) =>
//                       typeof item === 'string' && (
//                         <FooterIcon
//                           key={`item-${i}`}
//                           src={item}
//                           alt='partner'
//                           hoverEffect={section.isMarketplace}
//                         />
//                       ),
//                   )}
//                 </div>
//               )}

//               {section.maps?.map((mapSrc, i) => (
//                 <div
//                   key={`map-${i}`}
//                   className='border-divider relative border p-1'
//                 >
//                   <iframe
//                     title='map'
//                     src={mapSrc}
//                     className='h-32 w-full contrast-125 grayscale transition-all duration-1000 hover:grayscale-0'
//                     loading='lazy'
//                   />
//                   <div className='border-primary absolute -top-2 -right-2 size-4 border-t border-r' />
//                   <div className='border-primary absolute -bottom-2 -left-2 size-4 border-b border-l' />
//                 </div>
//               ))}

//               {!section.isGroup &&
//                 !section.isMarketplace &&
//                 !section.isCertificate && (
//                   <nav className='flex flex-col gap-4'>
//                     {section.items?.map(
//                       (link, i) =>
//                         typeof link === 'object' &&
//                         link !== null && (
//                           <a
//                             key={`l-${i}`}
//                             href={link.href}
//                             className='group text-default-500 hover:text-foreground flex items-center gap-3 text-xs tracking-widest uppercase transition-all'
//                           >
//                             <span className='bg-primary h-[1px] w-0 transition-all duration-300 group-hover:w-4' />
//                             {link.label}
//                           </a>
//                         ),
//                     )}
//                   </nav>
//                 )}
//             </div>
//           ))}
//         </div>

//         <div className='border-divider mt-20 flex flex-col items-center justify-between gap-10 border-t pt-10 md:flex-row'>
//           <div className='text-default-400 font-serif italic'>
//             {tFooter('copyright', { year, name: tSite('name') })}
//           </div>

//           <div className='flex items-center gap-8'>
//             {CURRENCY_LOCALE_MAP?.map((item) => (
//               <button
//                 key={item.country}
//                 className='group text-default-400 hover:text-primary relative text-[10px] font-bold tracking-[0.2em] uppercase transition-colors'
//               >
//                 {tCountry(item.country)}
//                 <span className='bg-primary absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full' />
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='group border-primary/30 hover:border-primary relative flex size-12 items-center justify-center border bg-[#1a1a1a] transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--heroui-primary-rgb),0.3)] sm:size-14'>
//     <img
//       src={src || ''}
//       alt={alt}
//       className={cn(
//         'z-10 h-7 w-auto object-contain transition-all duration-500 group-hover:brightness-125',
//         hoverEffect && 'group-hover:scale-110',
//       )}
//     />
//     <div className='border-primary absolute -top-[1px] -left-[1px] size-1.5 border-t border-l opacity-0 group-hover:opacity-100' />
//     <div className='border-primary absolute -right-[1px] -bottom-[1px] size-1.5 border-r border-b opacity-0 group-hover:opacity-100' />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = (tFooter.raw('Menu') as FooterMenuSection[]) || []

//   return (
//     <footer
//       className={cn(
//         'border-primary/50 selection:bg-primary w-full border-t-2 bg-[#0a0a0b] text-[#d1d1d1] selection:text-black',
//         className,
//       )}
//       {...props}
//     >
//       <div className='container mx-auto px-6 py-16'>
//         <div className='grid gap-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
//           {menuData.map((section, idx) => (
//             <div key={`section-${idx}`} className='flex flex-col gap-8'>
//               {!section.isGroup && section.title && (
//                 <div className='flex items-center gap-2'>
//                   <span className='text-primary font-mono text-xs font-bold tracking-widest uppercase'>
//                     {'>'} {section.title}_
//                   </span>
//                 </div>
//               )}

//               {section.isGroup &&
//                 section.subSections?.map((sub, sIdx) => (
//                   <div
//                     key={`sub-${idx}-${sIdx}`}
//                     className='flex flex-col gap-4'
//                   >
//                     <span className='text-default-400 font-mono text-[10px] uppercase'>
//                       [{sub.title}]
//                     </span>
//                     <div className='flex flex-wrap gap-2'>
//                       {sub.isShipping &&
//                         SHIPPING_PROVIDERS?.map((s, i) => (
//                           <FooterIcon
//                             key={`ship-${i}`}
//                             src={s?.image}
//                             alt='shipping'
//                           />
//                         ))}
//                       {sub.isPayment &&
//                         sub.items?.map((img, i) => (
//                           <FooterIcon
//                             key={`pay-${i}`}
//                             src={img}
//                             alt='payment'
//                           />
//                         ))}
//                     </div>
//                   </div>
//                 ))}

//               {(section.isMarketplace || section.isCertificate) && (
//                 <div className='flex flex-wrap gap-2'>
//                   {section.items?.map(
//                     (item, i) =>
//                       typeof item === 'string' && (
//                         <FooterIcon
//                           key={`item-${i}`}
//                           src={item}
//                           alt='partner'
//                           hoverEffect={section.isMarketplace}
//                         />
//                       ),
//                   )}
//                 </div>
//               )}

//               {section.maps?.map((mapSrc, i) => (
//                 <div
//                   key={`map-${i}`}
//                   className='group border-primary/20 hover:border-primary/60 relative border bg-black p-1 transition-all'
//                 >
//                   <iframe
//                     title='map'
//                     src={mapSrc}
//                     className='h-32 w-full opacity-60 grayscale invert transition-all duration-700 hover:opacity-100 hover:grayscale-0 hover:invert-0'
//                     loading='lazy'
//                   />
//                   <div className='border-primary/10 group-hover:border-primary/30 pointer-events-none absolute inset-0 border' />
//                 </div>
//               ))}

//               {!section.isGroup &&
//                 !section.isMarketplace &&
//                 !section.isCertificate && (
//                   <nav className='flex flex-col gap-3 font-mono text-[13px]'>
//                     {section.items?.map(
//                       (link, i) =>
//                         typeof link === 'object' &&
//                         link !== null && (
//                           <a
//                             key={`l-${i}`}
//                             href={link.href}
//                             className='group text-default-400 hover:text-primary flex items-center gap-2 transition-all'
//                           >
//                             <span className='inline-block w-0 overflow-hidden transition-all group-hover:w-3'>
//                               -
//                             </span>
//                             {link.label}
//                           </a>
//                         ),
//                     )}
//                   </nav>
//                 )}
//             </div>
//           ))}
//         </div>

//         <div className='border-primary/10 mt-20 flex flex-col items-center justify-between gap-6 border-t pt-10 font-mono text-[11px] md:flex-row'>
//           <div className='text-primary/60 flex items-center gap-4'>
//             <div className='bg-primary size-1.5 animate-pulse rounded-full' />
//             <span>
//               © {year} {tSite('name')}.SYS_ROOT
//             </span>
//           </div>

//           <div className='flex flex-wrap justify-center gap-2'>
//             {CURRENCY_LOCALE_MAP?.map((item) => (
//               <button
//                 key={item.country}
//                 className='border-primary/20 hover:bg-primary border px-3 py-1 uppercase transition-all hover:text-black'
//               >
//                 {tCountry(item.country)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='dark:bg-default-100 flex size-11 items-center justify-center rounded-tl-md rounded-tr-[1.2rem] rounded-br-md rounded-bl-[1.2rem] bg-white shadow-sm transition-all duration-500 hover:rounded-2xl sm:size-12'>
//     <img
//       src={src || ''}
//       alt={alt}
//       className={cn(
//         'h-6 w-auto bg-white object-contain transition-all duration-300',
//         hoverEffect && 'hover:scale-110',
//       )}
//     />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = (tFooter.raw('Menu') as FooterMenuSection[]) || []

//   return (
//     <footer
//       className={cn(
//         'w-full bg-[#fdfbf9] px-4 py-10 text-[#5a524d] dark:bg-[#0e0e0e] dark:text-[#d1cbc5]',
//         className,
//       )}
//       {...props}
//     >
//       <div className='container mx-auto'>
//         <div className='grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-5'>
//           {menuData.map((section, idx) => (
//             <div key={`organic-${idx}`} className='flex flex-col gap-5'>
//               {!section.isGroup && section.title && (
//                 <span className='text-md font-bold text-[#3d3733] italic dark:text-white'>
//                   {section.title}
//                 </span>
//               )}

//               {section.isGroup &&
//                 section.subSections?.map((sub, sIdx) => (
//                   <div
//                     key={`sub-${idx}-${sIdx}`}
//                     className='flex flex-col gap-3'
//                   >
//                     <span className='text-[10px] font-bold tracking-widest uppercase opacity-60'>
//                       {sub.title}
//                     </span>
//                     <div className='flex flex-wrap gap-2'>
//                       {sub.isShipping &&
//                         SHIPPING_PROVIDERS?.map((s, i) => (
//                           <FooterIcon
//                             key={`ship-${i}`}
//                             src={s?.image}
//                             alt='shipping'
//                           />
//                         ))}
//                       {sub.isPayment &&
//                         sub.items?.map((img, i) => (
//                           <FooterIcon
//                             key={`pay-${i}`}
//                             src={img}
//                             alt='payment'
//                           />
//                         ))}
//                     </div>
//                   </div>
//                 ))}

//               {(section.isMarketplace || section.isCertificate) && (
//                 <div className='flex flex-wrap gap-2'>
//                   {section.items?.map(
//                     (item, i) =>
//                       typeof item === 'string' && (
//                         <FooterIcon
//                           key={`item-${i}`}
//                           src={item}
//                           alt='partner'
//                           hoverEffect={section.isMarketplace}
//                         />
//                       ),
//                   )}
//                 </div>
//               )}

//               {section.maps?.map((mapSrc, i) => (
//                 <div
//                   key={`map-${i}`}
//                   className='mt-2 h-28 w-full overflow-hidden rounded-[2rem] rounded-tr-none border border-stone-200/50 shadow-inner dark:border-white/5'
//                 >
//                   <iframe
//                     title='map'
//                     src={mapSrc}
//                     className='h-full w-full opacity-90 grayscale'
//                     loading='lazy'
//                   />
//                 </div>
//               ))}

//               {!section.isGroup &&
//                 !section.isMarketplace &&
//                 !section.isCertificate &&
//                 !section.maps && (
//                   <nav className='flex flex-col gap-2.5'>
//                     {section.items?.map(
//                       (link, i) =>
//                         typeof link === 'object' &&
//                         link !== null && (
//                           <a
//                             key={`l-${i}`}
//                             href={link.href}
//                             className='hover:text-primary text-sm transition-all hover:translate-x-1'
//                           >
//                             {link.label}
//                           </a>
//                         ),
//                     )}
//                   </nav>
//                 )}
//             </div>
//           ))}
//         </div>

//         <div className='mt-12 flex flex-col items-center justify-between gap-6 border-t border-stone-200 pt-8 md:flex-row dark:border-white/10'>
//           <p className='text-[11px] font-medium opacity-60'>
//             © {year} {tSite('name')} —{' '}
//             {tFooter('copyright', { year: '', name: '' })}
//           </p>

//           <div className='flex flex-wrap justify-center gap-1.5'>
//             {CURRENCY_LOCALE_MAP?.map((item) => (
//               <button
//                 key={item.country}
//                 className='hover:bg-primary/20 rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold transition-all dark:bg-stone-800'
//               >
//                 {tCountry(item.country)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='border-divider bg-content2 hover:border-primary hover:bg-primary/5 flex h-10 w-14 items-center justify-center rounded-md border transition-all duration-300 sm:h-11 sm:w-16'>
//     <img
//       src={src || ''}
//       alt={alt}
//       className={cn(
//         'h-6 w-auto object-contain transition-all duration-300',
//         hoverEffect && 'hover:scale-110',
//       )}
//     />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = (tFooter.raw('Menu') as FooterMenuSection[]) || []

//   return (
//     <footer
//       className={cn(
//         'bg-background text-foreground w-full px-4 py-12 dark:bg-[#080808]',
//         className,
//       )}
//       {...props}
//     >
//       <div className='container mx-auto max-w-7xl'>
//         <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12'>
//           <div className='flex flex-col gap-6 lg:col-span-4'>
//             <div className='flex flex-col gap-2'>
//               <h2 className='text-primary text-2xl font-black tracking-tighter uppercase'>
//                 {tSite('name')}
//               </h2>
//               <p className='max-w-xs text-sm leading-relaxed opacity-50'>
//                 {tFooter('copyright', { year, name: '' })}
//               </p>
//             </div>

//             {menuData
//               .find((m) => m.isGroup)
//               ?.subSections?.map((sub, sIdx) => (
//                 <div key={`group-${sIdx}`} className='flex flex-col gap-3'>
//                   <span className='text-[10px] font-bold tracking-widest uppercase opacity-40'>
//                     {sub.title}
//                   </span>
//                   <div className='flex flex-wrap gap-2'>
//                     {sub.isShipping &&
//                       SHIPPING_PROVIDERS?.map((s, i) => (
//                         <FooterIcon
//                           key={`ship-${i}`}
//                           src={s?.image}
//                           alt='shipping'
//                         />
//                       ))}
//                     {sub.isPayment &&
//                       sub.items?.map((img, i) => (
//                         <FooterIcon key={`pay-${i}`} src={img} alt='payment' />
//                       ))}
//                   </div>
//                 </div>
//               ))}
//           </div>

//           <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8'>
//             {menuData
//               .filter((m) => !m.isGroup)
//               .map((section, idx) => (
//                 <div key={`strip-${idx}`} className='flex flex-col gap-3'>
//                   {section.title && (
//                     <span className='text-default-400 text-xs font-black tracking-wider uppercase'>
//                       {section.title}
//                     </span>
//                   )}

//                   <div className='flex flex-col gap-1.5'>
//                     {section.items?.map(
//                       (link, i) =>
//                         typeof link === 'object' &&
//                         link !== null && (
//                           <a
//                             key={`l-${i}`}
//                             href={link.href}
//                             className='group border-divider bg-content1 hover:border-primary hover:bg-primary/5 flex items-center justify-between rounded-lg border px-4 py-3 transition-all'
//                           >
//                             <span className='text-sm font-medium transition-all group-hover:translate-x-1'>
//                               {link.label}
//                             </span>
//                             <span className='text-primary translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100'>
//                               →
//                             </span>
//                           </a>
//                         ),
//                     )}

//                     {(section.isMarketplace || section.isCertificate) && (
//                       <div className='flex flex-wrap gap-2 pt-2'>
//                         {section.items?.map(
//                           (item, i) =>
//                             typeof item === 'string' && (
//                               <FooterIcon
//                                 key={`item-${i}`}
//                                 src={item}
//                                 alt='partner'
//                                 hoverEffect={section.isMarketplace}
//                               />
//                             ),
//                         )}
//                       </div>
//                     )}

//                     {section.maps?.map((mapSrc, i) => (
//                       <div
//                         key={`map-${i}`}
//                         className='border-divider mt-2 h-24 w-full overflow-hidden rounded-lg border'
//                       >
//                         <iframe
//                           title='map'
//                           src={mapSrc}
//                           className='h-full w-full contrast-125 grayscale'
//                           loading='lazy'
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>

//         <div className='border-divider mt-16 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row'>
//           <div className='flex gap-4 text-[11px] font-bold tracking-widest uppercase opacity-30'>
//             <span>Privacy Policy</span>
//             <span>Terms of Service</span>
//           </div>

//           <div className='flex flex-wrap gap-1'>
//             {CURRENCY_LOCALE_MAP?.map((item) => (
//               <button
//                 key={item.country}
//                 className='hover:bg-primary rounded px-3 py-1 text-[10px] font-black transition-all hover:text-white dark:bg-white/5'
//               >
//                 {tCountry(item.country)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { useTranslations } from 'next-intl'

// import type { ComponentProps } from 'react'

// import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
// import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
// import { cn } from '@/utils/style'

// interface FooterIconProps {
//   src: string
//   alt: string
//   hoverEffect?: boolean
// }

// const FooterIcon = ({ src, alt, hoverEffect }: FooterIconProps) => (
//   <div className='border-divider hover:bg-foreground flex size-10 items-center justify-center border bg-transparent transition-all duration-300 hover:invert dark:hover:bg-white dark:hover:invert-0'>
//     <img
//       src={src || ''}
//       alt={alt}
//       className={cn(
//         'h-5 w-auto object-contain brightness-100 grayscale',
//         hoverEffect && 'hover:scale-105',
//       )}
//     />
//   </div>
// )

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSubSection {
//   title: string
//   isShipping?: boolean
//   isPayment?: boolean
//   items?: string[]
// }

// interface FooterMenuSection {
//   title?: string
//   isGroup?: boolean
//   isMarketplace?: boolean
//   isCertificate?: boolean
//   subSections?: FooterSubSection[]
//   items?: (string | FooterLink)[]
//   maps?: string[]
// }

// type FooterProps = ComponentProps<'footer'>

// export const Footer = ({ className, ...props }: FooterProps) => {
//   const tFooter = useTranslations('Footer')
//   const tSite = useTranslations('Site')
//   const tCountry = useTranslations('Country')
//   const year = new Date().getFullYear()

//   const menuData = (tFooter.raw('Menu') as FooterMenuSection[]) || []

//   return (
//     <footer
//       className={cn(
//         'bg-background text-foreground w-full px-6 py-12 dark:bg-[#000000]',
//         className,
//       )}
//       {...props}
//     >
//       <div className='container mx-auto'>
//         <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5'>
//           {menuData.map((section, idx) => (
//             <div
//               key={`terminal-${idx}`}
//               className={cn(
//                 'flex flex-col gap-6 py-8 md:px-6 lg:py-0',
//                 idx !== 0 && 'border-divider/50 md:border-l',
//               )}
//             >
//               {!section.isGroup && section.title && (
//                 <div className='flex flex-col gap-2'>
//                   <span className='text-primary text-[11px] font-bold tracking-[0.3em] uppercase'>
//                     {section.title}
//                   </span>
//                   <div className='bg-divider/30 h-[1px] w-full' />
//                 </div>
//               )}

//               {section.isGroup &&
//                 section.subSections?.map((sub, sIdx) => (
//                   <div
//                     key={`sub-${idx}-${sIdx}`}
//                     className='flex flex-col gap-4'
//                   >
//                     <span className='text-[9px] font-bold tracking-widest uppercase opacity-40'>
//                       {sub.title}
//                     </span>
//                     <div className='flex flex-wrap gap-2'>
//                       {sub.isShipping &&
//                         SHIPPING_PROVIDERS?.map((s, i) => (
//                           <FooterIcon
//                             key={`ship-${i}`}
//                             src={s?.image}
//                             alt='shipping'
//                           />
//                         ))}
//                       {sub.isPayment &&
//                         sub.items?.map((img, i) => (
//                           <FooterIcon
//                             key={`pay-${i}`}
//                             src={img}
//                             alt='payment'
//                           />
//                         ))}
//                     </div>
//                   </div>
//                 ))}

//               {(section.isMarketplace || section.isCertificate) && (
//                 <div className='flex flex-wrap gap-2'>
//                   {section.items?.map(
//                     (item, i) =>
//                       typeof item === 'string' && (
//                         <FooterIcon
//                           key={`item-${i}`}
//                           src={item}
//                           alt='partner'
//                           hoverEffect={section.isMarketplace}
//                         />
//                       ),
//                   )}
//                 </div>
//               )}

//               {!section.isGroup &&
//                 !section.isMarketplace &&
//                 !section.isCertificate && (
//                   <nav className='flex flex-col gap-4'>
//                     {section.items?.map(
//                       (link, i) =>
//                         typeof link === 'object' &&
//                         link !== null && (
//                           <a
//                             key={`l-${i}`}
//                             href={link.href}
//                             className='hover:text-primary text-xs font-medium opacity-60 transition-all hover:opacity-100'
//                           >
//                             {link.label}
//                           </a>
//                         ),
//                     )}
//                   </nav>
//                 )}

//               {section.maps?.map((mapSrc, i) => (
//                 <div
//                   key={`map-${i}`}
//                   className='border-divider mt-auto border grayscale transition-all hover:grayscale-0'
//                 >
//                   <iframe
//                     title='map'
//                     src={mapSrc}
//                     className='h-24 w-full'
//                     loading='lazy'
//                   />
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         <div className='border-divider mt-16 flex flex-col items-center justify-between gap-8 border-t pt-10 md:flex-row'>
//           <div className='flex flex-col gap-1'>
//             <span className='text-sm font-black tracking-widest uppercase'>
//               {tSite('name')}
//             </span>
//             <p className='text-[10px] opacity-40'>
//               {tFooter('copyright', { year, name: '' })}
//             </p>
//           </div>

//           <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
//             {CURRENCY_LOCALE_MAP?.map((item) => (
//               <button
//                 key={item.country}
//                 className='border-divider hover:bg-foreground hover:text-background border px-4 py-2 text-[9px] font-bold tracking-tighter uppercase transition-all dark:hover:bg-white dark:hover:text-black'
//               >
//                 {tCountry(item.country)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }
