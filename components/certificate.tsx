import { Card, CardBody } from '@heroui/card'
import Image from 'next/image'

const CERTIFICATE_IMAGES = [
  '/certificate/certificate_1.png',
  '/certificate/certificate_2.png',
  '/certificate/certificate_3.png',
]

const Certificate = () => {
  return (
    <Card fullWidth>
      <CardBody className='flex w-full flex-col items-center justify-center gap-10 rounded-xl px-5 py-10'>
        <h2 className='mx-auto max-w-11/12 text-center text-2xl leading-tight font-bold sm:max-w-10/12 md:max-w-1/2 xl:max-w-1/3'>
          FAOS products are certified and licensed for safety by the relevant
          authorities, ensuring their{' '}
          <span className='text-primary-website underline'>
            quality and reliability.
          </span>
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

export { Certificate }
