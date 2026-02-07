import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

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

const AboutPage = () => {
  return (
    <Container className='flex flex-col gap-5 p-5'>
      <PdfViewer fileUrl='/documents/EN_Brochure-FAOS-Siam10-by-Nicolas.pdf' />
      <PdfViewer fileUrl='/documents/TH_Brochure-FAOS-Siam10-by-Nicolas.pdf' />
    </Container>
  )
}

export default AboutPage
