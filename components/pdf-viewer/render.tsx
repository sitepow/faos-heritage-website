'use client'

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'

export default function PdfViewerRender({ fileUrl }: { fileUrl: string }) {
  return (
    <div className='h-[80vh] w-full max-w-7xl overflow-hidden rounded-lg border border-slate-300'>
      <Worker workerUrl='/javascript/pdf.worker.min.js'>
        <Viewer fileUrl={fileUrl} defaultScale={SpecialZoomLevel.PageWidth} />
      </Worker>
    </div>
  )
}
