import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { PdfViewer } from '@/components/ui/PdfViewer/PdfViewer'
import { constructMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return constructMetadata({
    title: t('about.title'),
    description: t('about.description'),
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
          <PdfViewer fileUrl={PDF} />
        ))}
      </AppSection>
    </Container>
  )
}

export default AboutPage
