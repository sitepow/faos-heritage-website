import content from './content'
import ui from './ui'

export const nl = {
  ...ui,
  ...content,
} as const

export default nl
