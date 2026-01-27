/* eslint-disable react/no-array-index-key */
import type { FooterMenuSection } from '../types'

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
                src={img}
                alt='partner'
                hover={section.isMarketplace}
              />
            ),
        )}
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
              href={link.href}
              className='hover:text-primary text-gray-500 transition-all hover:translate-x-1 dark:text-gray-400'
            >
              {link.label}
            </a>
          ),
      )}
    </nav>
  )
}

export { FooterSection }
