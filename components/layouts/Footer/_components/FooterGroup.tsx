/* eslint-disable react/no-array-index-key */
import { FooterIcon } from './FooterIcon'

import { SHIPPING_PROVIDERS } from '@/constants'

interface FooterGroupProps {
  title: string
  isShipping?: boolean
  isPayment?: boolean
  items?: string[]
}

const FooterGroup = ({
  title,
  isShipping,
  isPayment,
  items,
}: FooterGroupProps) => (
  <div className='flex flex-col gap-4'>
    <h3 className='text-primary font-bold'>{title}</h3>

    <div className='flex flex-wrap gap-3'>
      {isShipping &&
        SHIPPING_PROVIDERS.map((s) => (
          <FooterIcon key={s.key} alt={s.label} src={s.image} />
        ))}

      {isPayment &&
        items?.map((img, i) => <FooterIcon key={i} alt='payment' src={img} />)}
    </div>
  </div>
)

export { FooterGroup }
