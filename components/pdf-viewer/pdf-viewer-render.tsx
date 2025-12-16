'use client'

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import type { FC } from 'react'

interface Props {
  fileUrl: string
}

const PdfViewerRender: FC<Props> = ({ fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div className='h-[80vh] w-full max-w-7xl overflow-hidden rounded-lg border'>
      <Worker workerUrl='/pdf.worker.min.js'>
        <Viewer
          defaultScale={SpecialZoomLevel.PageFit}
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  )
}

export default PdfViewerRender
