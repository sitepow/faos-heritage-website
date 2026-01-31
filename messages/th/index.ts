import content from './content'
import ui from './ui'

export const th = {
  ...ui,
  ...content,
} as const

export default th
