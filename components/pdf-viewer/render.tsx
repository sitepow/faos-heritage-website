'use client'

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PdfViewerRenderProps {
  fileUrl: string
}

export default function PdfViewerRender({ fileUrl }: PdfViewerRenderProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div className='h-[80vh] w-full max-w-7xl overflow-hidden rounded-lg border'>
      <Worker workerUrl='/javascript/pdf.worker.min.js'>
        <Viewer
          defaultScale={SpecialZoomLevel.PageWidth}
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  )
}
