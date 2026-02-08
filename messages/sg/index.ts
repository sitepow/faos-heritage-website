import content from './content'
import ui from './ui'

export const sg = {
  ...ui,
  ...content,
} as const

export default sg
