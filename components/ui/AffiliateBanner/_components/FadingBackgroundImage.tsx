/* eslint-disable @next/next/no-img-element */

const FadingBackgroundImage = () => {
  return (
    <div className='absolute inset-0 z-0 size-full [mask-image:linear-gradient(to_top,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_10%,transparent_100%)] md:inset-y-0 md:right-0 md:left-auto md:w-3/5 md:[mask-image:linear-gradient(to_left,black_40%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_left,black_40%,transparent_100%)]'>
      <img
        className='size-full object-cover object-center opacity-40 mix-blend-overlay'
        src='/images/banner/affiliate.jpg'
      />
    </div>
  )
}

export { FadingBackgroundImage }
