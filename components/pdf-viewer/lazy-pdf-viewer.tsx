'use client'

import dynamic from 'next/dynamic'

const LazyPdfViewer = dynamic(() => import('./pdf-viewer-render'), {
  ssr: false,
  loading: () => <p>Loading PDF Viewer...</p>,
})

export default LazyPdfViewer
