/* eslint-disable react/no-array-index-key */
import type { FooterMenuSection } from '../Footer.types'

import { FooterGroup } from './FooterGroup'
import { FooterIcon } from './FooterIcon'

const FooterSection = ({ section }: { section: FooterMenuSection }) => {
  if (section.isGroup) {
    return (
      <div className='flex flex-col gap-10'>
        {section.subSections?.map((sub, idx) => (
          <FooterGroup key={idx} {...sub} />
        ))}
      </div>
    )
  }

  if (section.isMarketplace || section.isCertificate) {
    return (
      <div className='flex flex-wrap gap-3'>
        {section.items?.map((item, i) => {
          if (typeof item === 'object' && 'image' in item) {
            return (
              <a
                key={i}
                className={
                  item.href === '#'
                    ? 'cursor-default'
                    : 'transition-opacity hover:opacity-80'
                }
                href={item.href}
                rel='noopener noreferrer'
                target={item.href !== '#' ? '_blank' : undefined}
              >
                <FooterIcon
                  alt='partner'
                  hover={section.isMarketplace}
                  src={item.image!}
                />
              </a>
            )
          }

          if (typeof item === 'string') {
            return (
              <FooterIcon
                key={i}
                alt='certification'
                hover={section.isMarketplace}
                src={item}
              />
            )
          }

          return null
        })}

        {section.maps?.map((mapSrc, i) => (
          <div
            key={`map-${i}`}
            className='border-default-100 mt-2 h-24 w-full overflow-hidden rounded-lg border'
          >
            <iframe
              className='h-full w-full contrast-125 grayscale'
              loading='lazy'
              src={mapSrc}
              title='map'
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <nav className='flex flex-col gap-3'>
      <ul className='list-disc pl-5'>
        {section.items?.map(
          (link, i) =>
            typeof link === 'object' &&
            'label' in link && (
              <li key={i} className='mb-2'>
                <a
                  className='hover:text-primary text-gray-500 transition-all dark:text-gray-400'
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ),
        )}
      </ul>
    </nav>
  )
}

export { FooterSection }
