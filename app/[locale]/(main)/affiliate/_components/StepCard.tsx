import type { StepItem } from './affiliate.types'

const StepCard = ({ number, title, description }: StepItem) => (
  <div className='group flex flex-col items-center p-5 text-center sm:p-0'>
    <div className='mb-6 flex size-14 items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-[#1a1f14] shadow-lg'>
      {number}.
    </div>
    <h3 className='mb-2 text-xl font-bold text-stone-800'>{title}</h3>
    <p className='text-lg leading-relaxed tracking-tight text-balance text-stone-500 sm:max-w-3/4 sm:text-xl'>
      {description}
    </p>
  </div>
)

export { StepCard }
