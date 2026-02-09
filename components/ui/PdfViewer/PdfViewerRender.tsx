'use client'

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'

import { PDF_WORKER_URL } from '@/constants'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { cn } from '@/utils'

interface PdfViewerProps {
  fileUrl: string
  className?: string
}

const PdfViewerRender = ({ fileUrl, className }: PdfViewerProps) => {
  return (
    <div
      className={cn(
        'border-default-100 h-dvh w-full overflow-hidden rounded-lg border bg-white',
        className,
      )}
    >
      <Worker workerUrl={PDF_WORKER_URL}>
        <Viewer defaultScale={SpecialZoomLevel.PageFit} fileUrl={fileUrl} />
      </Worker>
    </div>
  )
}

export default PdfViewerRender
export type { PdfViewerProps }
