import content from './content'
import ui from './ui'

export const cn = {
  ...ui,
  ...content,
} as const

export default cn
