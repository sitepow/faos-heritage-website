'use client'

import dynamic from 'next/dynamic'

import type { PdfViewerProps } from './PdfViewerRender'

const PdfViewer = dynamic<PdfViewerProps>(() => import('./PdfViewerRender'), {
  ssr: false,
})

export { PdfViewer }
