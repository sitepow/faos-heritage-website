'use client'

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'

import { PDF_WORKER_URL } from '@/constants'
import '@react-pdf-viewer/core/lib/styles/index.css'

export interface PdfViewerProps {
  fileUrl: string
  className?: string
}

export default function PdfViewerRender({
  fileUrl,
  className,
}: PdfViewerProps) {
  return (
    <div
      className={`border-default-100 h-dvh w-full overflow-hidden rounded-lg border bg-white ${className ?? ''}`}
    >
      <Worker workerUrl={PDF_WORKER_URL}>
        <Viewer defaultScale={SpecialZoomLevel.PageWidth} fileUrl={fileUrl} />
      </Worker>
    </div>
  )
}
