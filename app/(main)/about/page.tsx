import LazyPdfViewer from '@/components/pdf-viewer/lazy-pdf-viewer'

const About = () => {
  return (
    <section className='flex justify-center'>
      <LazyPdfViewer fileUrl='/Brochure.pdf' />
    </section>
  )
}

export default About
