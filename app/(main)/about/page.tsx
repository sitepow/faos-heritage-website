/* eslint-disable jsx-a11y/iframe-has-title */

const About = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center text-default-500'>
      <iframe
        className='h-[80vh] w-full max-w-7xl rounded-lg border'
        src='/about-faos.pdf'
      />
    </section>
  )
}

export default About
