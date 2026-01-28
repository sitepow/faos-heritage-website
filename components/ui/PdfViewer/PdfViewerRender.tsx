'use client'

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'

export interface PdfViewerProps {
  fileUrl: string
  className?: string
}

const PDF_WORKER_URL = '/javascript/pdf.worker.min.js'

export default function PdfViewerRender({
  fileUrl,
  className,
}: PdfViewerProps) {
  if (!fileUrl) {
    return (
      <div className='flex h-64 w-full items-center justify-center text-sm text-gray-500'>
        No PDF file
      </div>
    )
  }

  return (
    <div
      className={`h-dvh w-full overflow-hidden rounded-lg bg-white ${className ?? ''}`}
    >
      <Worker workerUrl={PDF_WORKER_URL}>
        <Viewer defaultScale={SpecialZoomLevel.PageWidth} fileUrl={fileUrl} />
      </Worker>
    </div>
  )
}
