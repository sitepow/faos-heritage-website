'use client'

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'

export default function PdfViewerRender({ fileUrl }: { fileUrl: string }) {
  return (
    <div className='h-dvh w-full overflow-hidden rounded-lg'>
      <Worker workerUrl='/javascript/pdf.worker.min.js'>
        <Viewer fileUrl={fileUrl} defaultScale={SpecialZoomLevel.PageWidth} />
      </Worker>
    </div>
  )
}
