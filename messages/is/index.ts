import content from './content'
import ui from './ui'

export const is = {
  ...ui,
  ...content,
} as const

export default is
