import { Container } from '@/components/layouts/Container'
import { PdfViewer } from '@/components/ui/PdfViewer/PdfViewer'

const AboutPage = () => {
  return (
    <Container>
      <PdfViewer fileUrl='/documents/faos-organic-olive-oil-brochure.pdf' />
    </Container>
  )
}

export default AboutPage
