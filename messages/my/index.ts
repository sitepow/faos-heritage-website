import content from './content'
import ui from './ui'

export const my = {
  ...ui,
  ...content,
} as const

export default my
