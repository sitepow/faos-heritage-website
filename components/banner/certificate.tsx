import { Card, CardBody } from '@heroui/card'
import Image from 'next/image'
import Link from 'next/link'

const CERTIFICATE_IMAGES = [
  '/certificate/certificate_1.png',
  '/certificate/certificate_2.png',
  '/certificate/certificate_3.png',
]

const BannerCertificate = () => {
  return (
    <Card fullWidth>
      <CardBody
        className='flex w-full flex-col items-center justify-center gap-10 rounded-xl px-5 py-10'
        style={{
          backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,1)),
          url(/banner/faos-moutain-green.jpg)
          `,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h2 className='mx-auto max-w-11/12 text-center text-2xl leading-tight font-bold text-white sm:max-w-10/12 md:max-w-1/2 xl:max-w-1/3'>
          FAOS products are officially certified and approved by relevant
          authorities, giving you confidence in their{' '}
          <Link href='/about'>
            <span className='underline'>safety, quality, and reliability.</span>
          </Link>
        </h2>

        <div className='flex flex-wrap gap-2'>
          {CERTIFICATE_IMAGES?.map((certificate) => (
            <Image
              key={certificate}
              alt={certificate}
              className='size-12 object-cover sm:size-20'
              height={100}
              src={certificate}
              width={100}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export { BannerCertificate }
