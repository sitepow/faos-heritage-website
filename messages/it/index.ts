import content from './content'
import ui from './ui'

export const it = {
  ...ui,
  ...content,
} as const

export default it
