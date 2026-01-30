import path from 'path'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

const QUERY_STALE_TIME = 5 * MINUTE
const QUERY_GC_TIME = 30 * MINUTE

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads')
const UPLOAD_URL_PREFIX = '/uploads'

const PDF_WORKER_URL = '/javascript/pdf.worker.min.js'

export {
  SECOND,
  MINUTE,
  HOUR,
  QUERY_STALE_TIME,
  QUERY_GC_TIME,
  PUBLIC_DIR,
  UPLOAD_DIR,
  UPLOAD_URL_PREFIX,
  PDF_WORKER_URL,
}
