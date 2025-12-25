'use client'

import { SectionHeader } from '@/components/common/heading'

export const PrivacyClient = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <SectionHeader title='Privacy Policy' />

      <span className='text-default-500 leading-relaxed sm:w-4/5 lg:w-1/2'>
        FAOS is committed to protecting the{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          privacy
        </span>{' '}
        and{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          personal data
        </span>{' '}
        of all users. All information relating to an identifiable individual
        shall be treated as{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          confidential
        </span>{' '}
        and maintained in a{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          secure manner
        </span>
        , including but not limited to personally identifiable information such
        as names, contact details, and{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          transaction data
        </span>
        . FAOS implements appropriate{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          technical and organizational security measures
        </span>{' '}
        to prevent{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          unauthorized access, disclosure, alteration, or destruction
        </span>{' '}
        of personal data. Personal information will be collected and processed
        solely for{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          legitimate business purposes
        </span>{' '}
        and in accordance with{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          applicable data protection laws
        </span>
        . Personal data will not be disclosed to{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          third parties
        </span>{' '}
        without{' '}
        <span className='decoration-primary underline decoration-dotted underline-offset-4'>
          prior consent
        </span>
        , except where required by law.
      </span>
    </section>
  )
}
