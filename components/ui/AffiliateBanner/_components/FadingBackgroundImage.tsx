/* eslint-disable @next/next/no-img-element */

const FadingBackgroundImage = () => {
  return (
    <div className='absolute inset-0 z-0 size-full [mask-image:linear-gradient(to_top,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_10%,transparent_100%)] md:inset-y-0 md:right-0 md:left-auto md:w-3/5 md:[mask-image:linear-gradient(to_left,black_40%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_left,black_40%,transparent_100%)]'>
      <img
        className='size-full object-cover object-center opacity-40 mix-blend-overlay'
        src={
          'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
      />
    </div>
  )
}

export { FadingBackgroundImage }
