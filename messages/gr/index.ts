import content from './content'
import ui from './ui'

export const gr = {
  ...ui,
  ...content,
} as const

export default gr
