import { CheckCircleIcon } from 'lucide-react'

const ADVERTISE_MESSAGE = [
  'Pure honey provides natural energy, helping you feel refreshed without the sharp sweetness of refined sugar.',
  'Many people choose honey because it contains antioxidants that help support the body and boost everyday immunity.',
  'Olive oil is a rich source of healthy fats and is widely used by health-conscious people to support heart health.',
  'Switching to olive oil instead of regular cooking oils can help reduce bad cholesterol and support long-term health.',
  'Honey can help soothe throat irritation and support a healthy digestive system.',
  'Olive oil contains polyphenols that help slow down cell aging and support healthy skin.',
  'Both honey and olive oil are natural ingredients, with no trans fats to worry about.',
  'Ideal for health-conscious individuals, seniors, and those managing their diet.',
  'Easy to use in many ways, from cooking and drinks to daily consumption.',
  'Start taking care of your health today by choosing better, natural ingredients.',
]

const AdvertiseItem = ({ message }: { message: string }) => {
  return (
    <div className='flex items-center gap-2 text-start'>
      <CheckCircleIcon className='mt-0.5 size-5 shrink-0' />
      <span className='leading-5'>{message}</span>
    </div>
  )
}

const BannerAdvertise = () => {
  return (
    <div
      className='flex w-full flex-col gap-6 rounded-xl p-6 text-white shadow-xl'
      style={{
        backgroundImage: `
        linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,1)),
        url(/banner/faos-waterfall-green.webp)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className='mx-auto max-w-11/12 text-center text-2xl leading-tight font-bold sm:max-w-10/12 md:max-w-1/2 xl:max-w-1/3'>
        Why Honey and Olive Oil are trusted choices for everyday healthy living
      </h2>

      <div className='mx-auto grid max-w-md gap-2 xl:max-w-4xl xl:grid-cols-2'>
        {ADVERTISE_MESSAGE.map((advertise) => (
          <AdvertiseItem key={advertise} message={advertise} />
        ))}
      </div>

      <p className='mx-auto mb-4 text-sm opacity-90'>
        Start taking care of your health today by choosing better, natural
        ingredients.
      </p>
    </div>
  )
}

export { BannerAdvertise }
