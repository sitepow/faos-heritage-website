import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { PdfViewer } from '@/components/ui/PdfViewer/PdfViewer'
import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  const keywords = t.raw('about.keywords')

  return constructMetadata({
    title: t('about.title'),
    description: t('about.description'),
    canonicalPath: '/about',
    keywords: keywords,
  })
}

const PDF_BROCHURE = [
  '/documents/EN_Brochure-FAOS-Siam10-by-Nicolas.pdf',
  '/documents/TH_Brochure-FAOS-Siam10-by-Nicolas.pdf',
]

const AboutPage = () => {
  return (
    <Container>
      <AppSection>
        {PDF_BROCHURE.map((PDF) => (
          <PdfViewer key={PDF} fileUrl={PDF} />
        ))}
      </AppSection>
    </Container>
  )
}

export { generateMetadata }
export default AboutPage
