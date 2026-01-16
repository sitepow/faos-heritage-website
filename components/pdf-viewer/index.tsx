'use client'

import dynamic from 'next/dynamic'

export const PdfViewer = dynamic(() => import('./render'), {
  ssr: false,
})
