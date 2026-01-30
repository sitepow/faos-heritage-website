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
        {section.items?.map(
          (img, i) =>
            typeof img === 'string' && (
              <FooterIcon
                key={i}
                alt='partner'
                hover={section.isMarketplace}
                src={img}
              />
            ),
        )}

        {section.maps?.map((mapSrc, i) => (
          <div
            key={`map-${i}`}
            className='border-divider mt-2 h-24 w-full overflow-hidden rounded-lg border'
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
      {section.items?.map(
        (link, i) =>
          typeof link === 'object' && (
            <a
              key={i}
              className='hover:text-primary text-gray-500 transition-all dark:text-gray-400'
              href={link.href}
            >
              {link.label}
            </a>
          ),
      )}
    </nav>
  )
}

export { FooterSection }
